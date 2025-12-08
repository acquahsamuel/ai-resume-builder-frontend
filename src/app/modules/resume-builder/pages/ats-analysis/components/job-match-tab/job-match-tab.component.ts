import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CvParserService } from '../../../../../../shared/services/cv-parser.service';
import { JobMatchData, FileUploadInfo } from '../../models/ats-analysis.models';

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
    jobKeywords: [],
    requiredSkills: [],
    resumeSkills: [],
    recommendations: [],
    isLoading: false
  };

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
          this.parseComparisonResponse(response.comparison);
          this.showSuccess('Job match analysis completed successfully');
        },
        error: (error) => {
          this.matchData.isLoading = false;
          console.error('Comparison error:', error);
          this.useDemoData();
          this.showError('Using demo data. API connection failed.');
        }
      });
  }

  private parseComparisonResponse(comparison: any): void {
    try {
      const matches = comparison.matches || [];
      const gaps = comparison.gaps || [];
      const recommendations = comparison.recommendations || [];

      this.matchData.resumeSkills = matches;
      this.matchData.requiredSkills = [...matches, ...gaps];

      const matchPercentage = this.matchData.requiredSkills.length > 0
        ? Math.round((matches.length / this.matchData.requiredSkills.length) * 100)
        : 0;

      this.matchData.overallScore = matchPercentage;

      this.matchData.jobKeywords = this.matchData.requiredSkills.map((skill: string) => ({
        word: skill,
        matched: matches.includes(skill),
        importance: 'high' as const
      }));

      this.matchData.recommendations = recommendations.map((rec: any) => ({
        priority: 'medium' as const,
        title: typeof rec === 'string' ? rec : rec.title || 'Recommendation',
        description: typeof rec === 'string' ? rec : rec.description || '',
        impact: '+5 points'
      })).slice(0, 3);

    } catch (error) {
      console.error('Error parsing comparison response:', error);
      this.useDemoData();
    }
  }

  private useDemoData(): void {
    this.matchData.overallScore = 78;
    this.matchData.requiredSkills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'AWS'];
    this.matchData.resumeSkills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'MongoDB', 'Express.js'];
    this.matchData.jobKeywords = [
      { word: 'JavaScript', matched: true, importance: 'high' },
      { word: 'React', matched: true, importance: 'high' },
      { word: 'Node.js', matched: true, importance: 'high' },
      { word: 'TypeScript', matched: true, importance: 'medium' },
      { word: 'Git', matched: true, importance: 'medium' },
      { word: 'AWS', matched: false, importance: 'high' },
    ];
    this.matchData.recommendations = [
      {
        priority: 'high',
        title: 'Add Missing Keywords',
        description: 'Include "AWS" to improve keyword matching',
        impact: '+12 points'
      },
      {
        priority: 'medium',
        title: 'Improve Keyword Density',
        description: 'Key skills should appear 2-3 times throughout your resume',
        impact: '+5 points'
      }
    ];
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
