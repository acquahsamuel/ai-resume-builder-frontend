import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CvParserService } from '../../../../../../shared/services/cv-parser.service';
import { JobMatchData, FileUploadInfo, ParsedAnalysisSection, Recommendation } from '../../models/ats-analysis.models';

@Component({
  selector: 'app-job-match-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-match-tab.component.html',
  styleUrls: ['./job-match-tab.component.scss']
})
export class JobMatchTabComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  matchData: JobMatchData = {
    jobDescription: '',
    overallScore: 0,
    comparisonResult: undefined,
    rawAnalysis: '',
    jobKeywords: [],
    requiredSkills: [],
    resumeSkills: [],
    recommendations: [],
    isLoading: false
  };

  parsedSections: ParsedAnalysisSection[] = [];

  constructor(
    private cvParserService: CvParserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!this.validateFile(file)) return;

      this.matchData.uploadedFile = {
        fileName: file.name,
        fileSize: this.formatFileSize(file.size),
        file: file
      };
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!this.validateFile(file)) return;

      this.matchData.uploadedFile = {
        fileName: file.name,
        fileSize: this.formatFileSize(file.size),
        file: file
      };
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('file-input-compare') as HTMLInputElement;
    fileInput?.click();
  }

  removeFile(): void {
    this.matchData.uploadedFile = undefined;
    this.matchData.overallScore = 0;
    this.matchData.rawAnalysis = '';
    this.parsedSections = [];
  }

  analyzeMatch(): void {
    if (!this.matchData.uploadedFile?.file) {
      this.showError('Please upload a CV file');
      return;
    }

    if (!this.matchData.jobDescription.trim()) {
      this.showError('Please provide a job description');
      return;
    }

    this.matchData.isLoading = true;

    this.cvParserService.compareCVFileWithJDText(
      this.matchData.uploadedFile.file,
      this.matchData.jobDescription
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.matchData.isLoading = false;
          if (response.success && response.comparison) {
            this.parseComparisonResponse(response.comparison);
            this.showSuccess('Job match analysis completed successfully');
          } else {
            this.showError('Comparison completed but no data received');
          }
        },
        error: (error) => {
          this.matchData.isLoading = false;
          console.error('Comparison error:', error);
          this.showError('API connection failed. Please try again.');
        }
      });
  }

  private parseComparisonResponse(comparisonText: string): void {
    try {
      // Store raw comparison text
      this.matchData.rawAnalysis = comparisonText;

      // Extract overall score from text like "Overall Fit Score: 5/100"
      const scoreMatch = comparisonText.match(/Overall\s+(?:Fit|Match)\s+Score[:\s]+(\d+)(?:\/100)?/i);
      if (scoreMatch) {
        this.matchData.overallScore = parseInt(scoreMatch[1]);
      }

      // Parse sections from the comparison text
      this.parsedSections = this.parseSections(comparisonText);

      // Extract keywords mentioned in the text
      this.extractKeywordsAndSkills(comparisonText);

      // Parse recommendations
      this.matchData.recommendations = this.parseRecommendations(comparisonText);

    } catch (error) {
      console.error('Error parsing comparison response:', error);
      this.showError('Error parsing comparison results');
    }
  }

  private parseSections(text: string): ParsedAnalysisSection[] {
    const sections: ParsedAnalysisSection[] = [];

    // Split by markdown headers (###, ####, or **)
    const headerPattern = /(?:#{2,4}\s+(.+?):|^\*\*(.+?:)\*\*)/gm;
    const matches = [...text.matchAll(headerPattern)];

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const title = (match[1] || match[2] || '').trim().replace(/:$/, '');

      // Get content until next header
      const startPos = match.index! + match[0].length;
      const endPos = i < matches.length - 1 ? matches[i + 1].index! : text.length;
      let content = text.substring(startPos, endPos).trim();

      // Extract bullet points
      const bulletPoints = content.match(/^\s*[\*\-\•]\s+(.+?)$/gm);
      const items = bulletPoints ? bulletPoints.map(b => b.replace(/^\s*[\*\-\•]\s+/, '').trim()) : [];

      sections.push({
        title,
        content,
        items: items.length > 0 ? items : undefined
      });
    }

    return sections;
  }

  private extractKeywordsAndSkills(text: string): void {
    // Extract "Missing Keywords" section
    const missingKeywordsMatch = text.match(/\*\*Missing Keywords Include:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/i);
    if (missingKeywordsMatch) {
      const keywords = missingKeywordsMatch[1]
        .split(/[,\n]/)
        .map(k => k.trim())
        .filter(k => k.length > 0);

      this.matchData.requiredSkills = keywords;
      this.matchData.jobKeywords = keywords.map(keyword => ({
        word: keyword,
        matched: false,
        importance: 'high' as const
      }));
    }

    // Extract matched skills from "Experience Match" or similar sections
    const experienceMatch = text.match(/Your CV[:\s]+(.+?)(?=\n\*\*|Job Description|$)/gs);
    if (experienceMatch) {
      const cvSkills: string[] = [];
      experienceMatch.forEach(match => {
        // Extract quoted phrases from CV examples
        const quotes = match.match(/"([^"]+)"/g);
        if (quotes) {
          quotes.forEach(q => {
            const skill = q.replace(/"/g, '').trim();
            if (skill.length > 3) {
              cvSkills.push(skill);
            }
          });
        }
      });

      this.matchData.resumeSkills = [...new Set(cvSkills)];
    }
  }

  private parseRecommendations(text: string): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Look for "Recommendations to Improve Match" section
    const recSection = text.match(/(?:###\s+)?Recommendations[^:]*:(.*?)(?=###|$)/si);
    if (!recSection) return recommendations;

    const recContent = recSection[1];

    // Extract numbered recommendations
    const recPattern = /(\d+)\.\s+\*\*(.+?)\*\*[:\s]*\n\s*\*\s+\*\*Description:\*\*\s*(.+?)(?:\n\s*\*\s+\*\*Specific Action:\*\*\s*(.+?))?(?=\n\d+\.|\n###|$)/gs;
    const recMatches = [...recContent.matchAll(recPattern)];

    recMatches.forEach(match => {
      const title = match[2].trim();
      const description = match[3].trim();
      const action = match[4] ? match[4].trim() : '';

      // Determine priority based on keywords
      let priority: 'high' | 'medium' | 'low' = 'medium';
      const titleLower = title.toLowerCase();
      if (titleLower.includes('fundamental') || titleLower.includes('critical') || titleLower.includes('do not')) {
        priority = 'high';
      } else if (titleLower.includes('career change') || titleLower.includes('hypothetical')) {
        priority = 'low';
      }

      let fullDescription = description;
      if (action) {
        fullDescription += '\n\nAction: ' + action;
      }

      recommendations.push({
        priority,
        title,
        description: fullDescription,
        impact: this.determineImpact(title, description)
      });
    });

    return recommendations.slice(0, 5); // Limit to top 5
  }

  private determineImpact(title: string, description: string): string {
    const combined = (title + ' ' + description).toLowerCase();

    if (combined.includes('mismatch') || combined.includes('do not apply')) {
      return 'Not suitable for this role';
    } else if (combined.includes('career change') || combined.includes('transition')) {
      return 'Requires significant effort';
    } else if (combined.includes('certifications') || combined.includes('training')) {
      return 'Improves qualifications';
    }

    return 'Improves match score';
  }

  private validateFile(file: File): boolean {
    const validTypes = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      this.showError('Please upload a PDF or Word document');
      return false;
    }

    if (file.size > maxSize) {
      this.showError('File size should not exceed 10MB');
      return false;
    }

    return true;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getScoreColor(): string {
    if (this.matchData.overallScore >= 80) return 'text-green-600';
    if (this.matchData.overallScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  getScoreBadgeColor(): string {
    if (this.matchData.overallScore >= 80) return 'bg-green-100 text-green-700';
    if (this.matchData.overallScore >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  }

  getMatchedSkills(): string[] {
    return this.matchData.requiredSkills.filter(skill =>
      this.matchData.resumeSkills.some(resumeSkill =>
        resumeSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }

  getMissingSkills(): string[] {
    return this.matchData.requiredSkills.filter(skill =>
      !this.matchData.resumeSkills.some(resumeSkill =>
        resumeSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }

  getMatchedKeywordsCount(): number {
    return this.matchData.jobKeywords.filter(k => k.matched).length;
  }

  getTotalKeywordsCount(): number {
    return this.matchData.jobKeywords.length;
  }

  private showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message
    });
  }

  private showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }
}
