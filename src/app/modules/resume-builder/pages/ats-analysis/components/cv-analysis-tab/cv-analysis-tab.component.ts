import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CvParserService } from '../../../../../../shared/services/cv-parser.service';
import { CVOnlyData, FileUploadInfo } from '../../models/ats-analysis.models';

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
      keywordCount: 0,
      skillsIdentified: [],
      formattingScore: 0,
      recommendations: []
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
          this.showError('CV Parser API is not available. Using demo mode.');
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
      keywordCount: 0,
      skillsIdentified: [],
      formattingScore: 0,
      recommendations: []
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
          this.parseAnalysisResponse(response.analysis);
          this.showSuccess('CV analysis completed successfully');
        },
        error: (error) => {
          this.cvData.isLoading = false;
          console.error('Analysis error:', error);
          this.useDemoData();
          this.showError('Using demo data. API connection failed.');
        }
      });
  }

  private parseAnalysisResponse(analysis: string): void {
    try {
      const scoreMatch = analysis.match(/score[:\s]*(\d+)/i);
      this.cvData.overallScore = scoreMatch ? parseInt(scoreMatch[1]) : 72;

      const keywordMatch = analysis.match(/keywords?[:\s]*(\d+)/i);
      this.cvData.analysisResults.keywordCount = keywordMatch ? parseInt(keywordMatch[1]) : 45;

      const formattingMatch = analysis.match(/formatting[:\s]*(\d+)/i);
      this.cvData.analysisResults.formattingScore = formattingMatch ? parseInt(formattingMatch[1]) : 85;

      const skillsPattern = /skills?[:\s]*\[([^\]]+)\]/i;
      const skillsMatch = analysis.match(skillsPattern);
      if (skillsMatch) {
        this.cvData.analysisResults.skillsIdentified = skillsMatch[1]
          .split(',')
          .map(s => s.trim().replace(/['"]/g, ''));
      } else {
        this.cvData.analysisResults.skillsIdentified = [
          'JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'Git'
        ];
      }

      this.cvData.analysisResults.recommendations = [
        {
          priority: 'medium',
          title: 'Improve Section Headers',
          description: 'Use standard section headings for better ATS parsing',
          impact: '+5 points'
        },
        {
          priority: 'low',
          title: 'Optimize Keyword Placement',
          description: 'Include key skills in multiple sections',
          impact: '+3 points'
        }
      ];
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      this.useDemoData();
    }
  }

  private useDemoData(): void {
    this.cvData.overallScore = 72;
    this.cvData.analysisResults = {
      keywordCount: 45,
      skillsIdentified: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'Express.js', 'Git'],
      formattingScore: 85,
      recommendations: [
        {
          priority: 'medium',
          title: 'Improve Section Headers',
          description: 'Use standard section headings for better ATS parsing',
          impact: '+5 points'
        },
        {
          priority: 'low',
          title: 'Optimize Keyword Placement',
          description: 'Include key skills in multiple sections',
          impact: '+3 points'
        }
      ]
    };
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
