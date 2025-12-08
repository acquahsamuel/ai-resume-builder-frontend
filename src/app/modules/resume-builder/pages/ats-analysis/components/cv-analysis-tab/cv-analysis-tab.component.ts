import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CvParserService } from '../../../../../../shared/services/cv-parser.service';
import { TextFormatterService } from '../../../../../../shared/services/text-formatter.service';

@Component({
  selector: 'app-cv-analysis-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cv-analysis-tab.component.html',
  styleUrls: ['./cv-analysis-tab.component.scss']
})
export class CvAnalysisTabComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  uploadedFile?: { fileName: string; fileSize: string; file: File };
  overallScore = 0;
  analysisText = '';
  formattedAnalysis = '';
  isLoading = false;

  constructor(
    private cvParserService: CvParserService,
    private messageService: MessageService,
    private textFormatter: TextFormatterService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.validateFile(file)) {
      this.uploadedFile = {
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
    const file = event.dataTransfer?.files[0];
    if (file && this.validateFile(file)) {
      this.uploadedFile = {
        fileName: file.name,
        fileSize: this.formatFileSize(file.size),
        file: file
      };
    }
  }

  triggerFileInput(): void {
    document.getElementById('file-input-cvOnly')?.click();
  }

  removeFile(): void {
    this.uploadedFile = undefined;
    this.overallScore = 0;
    this.analysisText = '';
  }

  analyzeCv(): void {
    if (!this.uploadedFile?.file) {
      this.showMessage('error', 'Please upload a CV file');
      return;
    }

    this.isLoading = true;
    this.cvParserService.analyzeCVFile(this.uploadedFile.file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.analysis) {
            this.analysisText = response.analysis;
            this.extractScore(response.analysis);
            this.formatAnalysisText(response.analysis);
            this.showMessage('success', 'CV analysis completed successfully');
          } else {
            this.showMessage('error', 'Analysis completed but no data received');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Analysis error:', error);
          this.showMessage('error', 'API connection failed. Please try again.');
        }
      });
  }

  private extractScore(text: string): void {
    const scoreMatch = text.match(/Overall\s+ATS\s+Score[:\s*]+(\d+)/i);
    if (scoreMatch) {
      this.overallScore = parseInt(scoreMatch[1]);
    }
  }

  private formatAnalysisText(rawText: string): void {
    // Add report header
    const header = this.textFormatter.createReportHeader('analysis', this.overallScore);

    // Format the analysis content
    const formattedContent = this.textFormatter.formatAnalysis(rawText);

    // Combine header and content
    this.formattedAnalysis = header + '\n' + formattedContent;
  }

  copyToClipboard(): void {
    const textToCopy = this.formattedAnalysis || this.analysisText;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(
      () => this.showMessage('success', 'Analysis copied to clipboard'),
      () => this.showMessage('error', 'Failed to copy to clipboard')
    );
  }

  getScoreColor(): string {
    if (this.overallScore >= 80) return 'text-green-600';
    if (this.overallScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  getScoreBadgeColor(): string {
    if (this.overallScore >= 80) return 'bg-green-100 text-green-700 border-green-300';
    if (this.overallScore >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  }

  private validateFile(file: File): boolean {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      this.showMessage('error', 'Please upload a PDF or Word document');
      return false;
    }

    if (file.size > maxSize) {
      this.showMessage('error', 'File size should not exceed 10MB');
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

  private showMessage(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      summary: severity === 'error' ? 'Error' : severity === 'success' ? 'Success' : 'Info',
      detail
    });
  }
}
