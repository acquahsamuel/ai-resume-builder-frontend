import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CvParserService } from '../../../../../../shared/services/cv-parser.service';
import { CVOnlyData, FileUploadInfo, ParsedAnalysisSection, Recommendation } from '../../models/ats-analysis.models';

@Component({
  selector: 'app-cv-analysis-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cv-analysis-tab.component.html',
  styleUrls: ['./cv-analysis-tab.component.scss']
})
export class CvAnalysisTabComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  cvData: CVOnlyData = {
    overallScore: 0,
    analysisResults: {
      overallScore: 0,
      rawAnalysis: '',
      sections: [],
      recommendations: [],
      skillsIdentified: [],
      keywordCount: 0,
      formattingScore: 0
    },
    isLoading: false
  };

  constructor(
    private cvParserService: CvParserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.checkAPIHealth();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkAPIHealth(): void {
    this.cvParserService.healthCheck()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.agent_initialized) {
            this.showWarning('CV Parser API is initializing. Please wait...');
          }
        },
        error: (error) => {
          console.error('API Health Check Failed:', error);
        }
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!this.validateFile(file)) return;

      this.cvData.uploadedFile = {
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

      this.cvData.uploadedFile = {
        fileName: file.name,
        fileSize: this.formatFileSize(file.size),
        file: file
      };
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('file-input-cvOnly') as HTMLInputElement;
    fileInput?.click();
  }

  removeFile(): void {
    this.cvData.uploadedFile = undefined;
    this.cvData.overallScore = 0;
    this.cvData.analysisResults = {
      overallScore: 0,
      rawAnalysis: '',
      sections: [],
      recommendations: [],
      skillsIdentified: [],
      keywordCount: 0,
      formattingScore: 0
    };
  }

  analyzeCv(): void {
    if (!this.cvData.uploadedFile?.file) {
      this.showError('Please upload a CV file first');
      return;
    }

    this.cvData.isLoading = true;

    this.cvParserService.analyzeCVFile(this.cvData.uploadedFile.file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.cvData.isLoading = false;
          if (response.success && response.analysis) {
            this.parseAnalysisResponse(response.analysis);
            this.showSuccess('CV analysis completed successfully');
          } else {
            this.showError('Analysis completed but no data received');
          }
        },
        error: (error) => {
          this.cvData.isLoading = false;
          console.error('Analysis error:', error);
          this.showError('API connection failed. Please try again.');
        }
      });
  }

  private parseAnalysisResponse(analysisText: string): void {
    try {
      // Store raw analysis
      this.cvData.analysisResults.rawAnalysis = analysisText;

      // Extract overall score from text like "Overall ATS Score: 78/100"
      const scoreMatch = analysisText.match(/Overall\s+ATS\s+Score[:\s]+(\d+)(?:\/100)?/i);
      if (scoreMatch) {
        this.cvData.overallScore = parseInt(scoreMatch[1]);
        this.cvData.analysisResults.overallScore = this.cvData.overallScore;
      }

      // Parse sections
      this.cvData.analysisResults.sections = this.parseSections(analysisText);

      // Extract recommendations
      this.cvData.analysisResults.recommendations = this.parseRecommendations(analysisText);

      // Extract skills if mentioned
      this.cvData.analysisResults.skillsIdentified = this.extractSkills(analysisText);

      // Try to extract keyword count
      const keywordMatch = analysisText.match(/(\d+)\s+keywords?/i);
      if (keywordMatch) {
        this.cvData.analysisResults.keywordCount = parseInt(keywordMatch[1]);
      }

    } catch (error) {
      console.error('Error parsing analysis response:', error);
      this.showError('Error parsing analysis results');
    }
  }

  private parseSections(text: string): ParsedAnalysisSection[] {
    const sections: ParsedAnalysisSection[] = [];

    // Split by markdown headers (### or **)
    const headerPattern = /(?:###\s+(.+?):|^\*\*(\d+\.\s+.+?:)\*\*)/gm;
    const matches = [...text.matchAll(headerPattern)];

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const title = (match[1] || match[2] || '').trim().replace(/^\d+\.\s*/, '').replace(/:$/, '');

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

  private parseRecommendations(text: string): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Look for recommendation patterns
    const priorityPattern = /\*\*(.+?Priority)\*\*:\s*(.*?)(?=\n\*\*|$)/gs;
    const matches = [...text.matchAll(priorityPattern)];

    for (const match of matches) {
      const priority = match[1].toLowerCase().includes('critical') ? 'high' :
                      match[1].toLowerCase().includes('medium') ? 'medium' : 'low';

      const content = match[2].trim();
      const items = content.match(/^\s*[\*\-\•]\s+(.+?)$/gm);

      if (items) {
        items.forEach(item => {
          const cleaned = item.replace(/^\s*[\*\-\•]\s+/, '').trim();
          recommendations.push({
            priority,
            title: this.extractTitle(cleaned),
            description: cleaned,
            impact: this.extractImpact(cleaned)
          });
        });
      }
    }

    // If no structured recommendations found, extract from "Recommendation" sections
    if (recommendations.length === 0) {
      const recPattern = /\*\*Recommendation[^:]*:\*\*\s*(.+?)(?=\n\*\*|$)/gs;
      const recMatches = [...text.matchAll(recPattern)];

      recMatches.forEach(match => {
        recommendations.push({
          priority: 'medium',
          title: 'Recommendation',
          description: match[1].trim(),
          impact: 'Improves ATS compatibility'
        });
      });
    }

    return recommendations.slice(0, 10); // Limit to top 10
  }

  private extractSkills(text: string): string[] {
    const skills: string[] = [];

    // Look for common technical skills and programming languages
    const skillPatterns = [
      /\b(JavaScript|TypeScript|Python|Java|C\+\+|PHP|Ruby|Go|Rust|Swift|Kotlin)\b/g,
      /\b(React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel)\b/g,
      /\b(MongoDB|PostgreSQL|MySQL|Redis|DynamoDB|Cassandra)\b/g,
      /\b(AWS|Azure|GCP|Docker|Kubernetes|CI\/CD|Git)\b/g
    ];

    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        skills.push(...matches);
      }
    });

    // Remove duplicates
    return [...new Set(skills)];
  }

  private extractTitle(text: string): string {
    // Extract first sentence or up to 60 characters
    const firstSentence = text.split(/[.!?]/)[0];
    return firstSentence.length > 60 ? firstSentence.substring(0, 60) + '...' : firstSentence;
  }

  private extractImpact(text: string): string {
    const impactMatch = text.match(/\+(\d+)\s*points?/i);
    return impactMatch ? `+${impactMatch[1]} points` : 'Improves ATS compatibility';
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

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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

  private showWarning(message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: message
    });
  }
}
