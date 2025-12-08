import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CvParserService } from '../../../../../../shared/services/cv-parser.service';
import { TextFormatterService } from '../../../../../../shared/services/text-formatter.service';

@Component({
  selector: 'app-cv-rewrite-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cv-rewrite-tab.component.html',
  styleUrls: ['./cv-rewrite-tab.component.scss']
})
export class CvRewriteTabComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  uploadedFile?: { fileName: string; fileSize: string; file: File };
  jobDescription = '';
  rewrittenCv = '';
  formattedCv = '';
  isProcessing = false;

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
    document.getElementById('file-input-rewrite')?.click();
  }

  removeFile(): void {
    this.uploadedFile = undefined;
    this.rewrittenCv = '';
  }

  rewriteCv(): void {
    if (!this.uploadedFile?.file) {
      this.showMessage('error', 'Please upload a CV file');
      return;
    }

    if (!this.jobDescription.trim()) {
      this.showMessage('error', 'Please provide a job description');
      return;
    }

    this.isProcessing = true;
    const focusAreas = 'achievements,keywords,impact,formatting';

    this.cvParserService.rewriteCVFile(
      this.uploadedFile.file,
      this.jobDescription,
      focusAreas
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isProcessing = false;
          this.rewrittenCv = response.rewritten_cv;
          this.formatRewrittenCv(response.rewritten_cv);
          this.showMessage('success', 'CV rewrite completed successfully');
        },
        error: (error) => {
          this.isProcessing = false;
          console.error('Rewrite error:', error);
          this.showMessage('error', 'API connection failed. Please try again.');
        }
      });
  }

  private formatRewrittenCv(rawText: string): void {
    // Add report header
    const header = this.textFormatter.createReportHeader('rewrite');

    // Format the rewritten CV content
    const formattedContent = this.textFormatter.formatRewrittenCV(rawText);

    // Combine header and content
    this.formattedCv = header + '\n' + formattedContent;
  }

  copyToClipboard(): void {
    const textToCopy = this.formattedCv || this.rewrittenCv;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(
      () => this.showMessage('success', 'Rewritten CV copied to clipboard'),
      () => this.showMessage('error', 'Failed to copy to clipboard')
    );
  }

  downloadRewrittenCv(): void {
    const textToDownload = this.formattedCv || this.rewrittenCv;
    if (!textToDownload) return;

    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rewritten-cv.txt';
    link.click();
    window.URL.revokeObjectURL(url);

    this.showMessage('success', 'CV downloaded successfully');
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
