import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CvParserService } from '../../../../../../shared/services/cv-parser.service';
import { TextFormatterService } from '../../../../../../shared/services/text-formatter.service';

@Component({
  selector: 'app-job-match-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-match-tab.component.html',
  styleUrls: ['./job-match-tab.component.scss']
})
export class JobMatchTabComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  uploadedFile?: { fileName: string; fileSize: string; file: File };
  jobDescription = '';
  overallScore = 0;
  comparisonText = '';
  formattedComparison = '';
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
    document.getElementById('file-input-compare')?.click();
  }

  removeFile(): void {
    this.uploadedFile = undefined;
    this.overallScore = 0;
    this.comparisonText = '';
  }

  analyzeMatch(): void {
    if (!this.uploadedFile?.file) {
      this.showMessage('error', 'Please upload a CV file');
      return;
    }

    if (!this.jobDescription.trim()) {
      this.showMessage('error', 'Please provide a job description');
      return;
    }

    this.isLoading = true;
    this.cvParserService.compareCVFileWithJDText(
      this.uploadedFile.file,
      this.jobDescription
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.comparison) {
            this.comparisonText = response.comparison;
            this.extractScore(response.comparison);
            this.formatComparisonText(response.comparison);
            this.showMessage('success', 'Job match analysis completed successfully');
          } else {
            this.showMessage('error', 'Comparison completed but no data received');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Comparison error:', error);
          this.showMessage('error', 'API connection failed. Please try again.');
        }
      });
  }

  private extractScore(text: string): void {
    const scoreMatch = text.match(/Overall\s+(?:Fit|Match)\s+Score[:\s*]+(\d+)/i);
    if (scoreMatch) {
      this.overallScore = parseInt(scoreMatch[1]);
    }
  }

  private formatComparisonText(rawText: string): void {
    // Add report header
    const header = this.textFormatter.createReportHeader('comparison', this.overallScore);

    // Format the comparison content
    const formattedContent = this.textFormatter.formatComparison(rawText);

    // Combine header and content
    this.formattedComparison = header + '\n' + formattedContent;
  }

  copyToClipboard(): void {
    const textToCopy = this.formattedComparison || this.comparisonText;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(
      () => this.showMessage('success', 'Comparison copied to clipboard'),
      () => this.showMessage('error', 'Failed to copy to clipboard')
    );
  }

  getScoreColor(): string {
    if (this.overallScore >= 80) return 'text-green-600';
    if (this.overallScore >= 60) return 'text-yellow-600';
    if (this.overallScore >= 40) return 'text-orange-600';
    return 'text-red-600';
  }

  getScoreBadgeColor(): string {
    if (this.overallScore >= 80) return 'bg-green-100 text-green-700 border-green-300';
    if (this.overallScore >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (this.overallScore >= 40) return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-red-100 text-red-700 border-red-300';
  }

  getMatchLabel(): string {
    if (this.overallScore >= 80) return 'Excellent Match';
    if (this.overallScore >= 60) return 'Good Match';
    if (this.overallScore >= 40) return 'Moderate Match';
    return 'Low Match';
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
