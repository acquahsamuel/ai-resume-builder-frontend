import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CvParserService } from '../../../../../../shared/services/cv-parser.service';
import {
  CVRewriteData,
  FileUploadInfo,
} from '../../models/ats-analysis.models';

@Component({
  selector: 'app-cv-rewrite-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cv-rewrite-tab.component.html',
  styleUrls: ['./cv-rewrite-tab.component.scss'],
})
export class CvRewriteTabComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  rewriteData: CVRewriteData = {
    jobDescription: '',
    originalCv: '',
    rewrittenCv: '',
    improvements: [],
    isProcessing: false,
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

      this.rewriteData.uploadedFile = {
        fileName: file.name,
        fileSize: this.formatFileSize(file.size),
        file: file,
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

      this.rewriteData.uploadedFile = {
        fileName: file.name,
        fileSize: this.formatFileSize(file.size),
        file: file,
      };
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById(
      'file-input-rewrite'
    ) as HTMLInputElement;
    fileInput?.click();
  }

  removeFile(): void {
    this.rewriteData.uploadedFile = undefined;
    this.rewriteData.rewrittenCv = '';
    this.rewriteData.improvements = [];
  }

  rewriteCv(): void {
    if (!this.rewriteData.uploadedFile?.file) {
      this.showError('Please upload a CV file');
      return;
    }

    if (!this.rewriteData.jobDescription.trim()) {
      this.showError('Please provide a job description');
      return;
    }

    this.rewriteData.isProcessing = true;

    const focusAreas = 'achievements,keywords,impact,formatting';

    this.cvParserService
      .rewriteCVFile(
        this.rewriteData.uploadedFile.file,
        this.rewriteData.jobDescription,
        focusAreas
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.rewriteData.isProcessing = false;
          this.rewriteData.rewrittenCv = response.rewritten_cv;
          this.parseImprovements(response.rewritten_cv);
          this.showSuccess('CV rewrite completed successfully');
        },
        error: (error) => {
          this.rewriteData.isProcessing = false;
          console.error('Rewrite error:', error);
          this.showError('API connection failed. Please try again.');
        },
      });
  }

  private parseImprovements(rewrittenCv: string): void {
    try {
      // Extract improvements from the rewritten CV by comparing sections
      // Look for improvement indicators in the response
      const improvements: Array<{
        section: string;
        change: string;
        impact: 'High' | 'Medium' | 'Low';
      }> = [];

      // Parse improvement sections if they exist in the response
      const improvementPattern =
        /(?:###\s+)?Improvements?[:\s]+(.*?)(?=###|$)/is;
      const improvementMatch = rewrittenCv.match(improvementPattern);

      if (improvementMatch) {
        const improvementText = improvementMatch[1];
        const itemPattern = /^\s*[\*\-\•]\s+(.+?)$/gm;
        const items = [...improvementText.matchAll(itemPattern)];

        items.forEach((item) => {
          const text = item[1].trim();
          // Determine section and impact based on keywords
          let section = 'General';
          let impact: 'High' | 'Medium' | 'Low' = 'Medium';

          if (
            text.toLowerCase().includes('summary') ||
            text.toLowerCase().includes('profile')
          ) {
            section = 'Summary';
            impact = 'High';
          } else if (
            text.toLowerCase().includes('experience') ||
            text.toLowerCase().includes('achievement')
          ) {
            section = 'Experience';
            impact = 'High';
          } else if (text.toLowerCase().includes('skill')) {
            section = 'Skills';
          } else if (
            text.toLowerCase().includes('format') ||
            text.toLowerCase().includes('structure')
          ) {
            section = 'Formatting';
          }

          improvements.push({
            section,
            change: text,
            impact,
          });
        });
      }

      this.rewriteData.improvements =
        improvements.length > 0 ? improvements : [];
    } catch (error) {
      console.error('Error parsing improvements:', error);
      this.rewriteData.improvements = [];
    }
  }

  downloadRewrittenCv(): void {
    if (!this.rewriteData.rewrittenCv) return;

    const blob = new Blob([this.rewriteData.rewrittenCv], {
      type: 'text/plain',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rewritten-cv.txt';
    link.click();
    window.URL.revokeObjectURL(url);

    this.showSuccess('CV downloaded successfully');
  }

  private validateFile(file: File): boolean {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
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
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  private showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  private showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}
