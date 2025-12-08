import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CvParserService } from '../../../../../../shared/services/cv-parser.service';
import { CVRewriteData, FileUploadInfo } from '../../models/ats-analysis.models';

@Component({
  selector: 'app-cv-rewrite-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cv-rewrite-tab.component.html',
  styleUrls: ['./cv-rewrite-tab.component.scss']
})
export class CvRewriteTabComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  rewriteData: CVRewriteData = {
    jobDescription: '',
    originalCv: '',
    rewrittenCv: '',
    improvements: [],
    isProcessing: false
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

      this.rewriteData.uploadedFile = {
        fileName: file.name,
        fileSize: this.formatFileSize(file.size),
        file: file
      };
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('file-input-rewrite') as HTMLInputElement;
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

    this.cvParserService.rewriteCVFile(
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
          this.useDemoData();
          this.showError('Using demo data. API connection failed.');
        }
      });
  }

  private parseImprovements(rewrittenCv: string): void {
    try {
      this.rewriteData.improvements = [
        {
          section: 'Summary',
          change: 'Added industry-specific keywords and tailored to job requirements',
          impact: 'High'
        },
        {
          section: 'Experience',
          change: 'Enhanced action verbs and quantified achievements with metrics',
          impact: 'High'
        },
        {
          section: 'Skills',
          change: 'Aligned technical skills with job description requirements',
          impact: 'Medium'
        },
        {
          section: 'Formatting',
          change: 'Optimized for ATS parsing with standard section headers',
          impact: 'Medium'
        }
      ];
    } catch (error) {
      console.error('Error parsing improvements:', error);
    }
  }

  private useDemoData(): void {
    this.rewriteData.rewrittenCv = `PROFESSIONAL SUMMARY
Results-driven Software Engineer with 6+ years of experience in full-stack development. Proven expertise in JavaScript, React, Node.js, and TypeScript. Successfully delivered 15+ enterprise applications, improving system performance by 40% and reducing deployment time by 30%.

TECHNICAL SKILLS
Frontend: JavaScript, TypeScript, React, HTML5, CSS3, Redux
Backend: Node.js, Express.js, REST APIs, GraphQL
Database: MongoDB, PostgreSQL, Redis
DevOps: Git, Docker, CI/CD, AWS, Jenkins
Methodologies: Agile, Scrum, Test-Driven Development

PROFESSIONAL EXPERIENCE

Senior Software Engineer | Tech Solutions Inc. | 2020 - Present
• Architected and developed 5 high-traffic web applications serving 100K+ daily users
• Optimized application performance, reducing page load time by 45%
• Implemented automated testing framework, increasing code coverage from 60% to 95%
• Mentored team of 4 junior developers, improving team productivity by 25%

Software Engineer | Digital Innovations Ltd. | 2018 - 2020
• Designed and implemented RESTful APIs handling 1M+ requests daily
• Collaborated with cross-functional teams to deliver 10+ client projects
• Reduced bug count by 35% through implementation of code review best practices
• Integrated third-party services (Stripe, SendGrid) for enhanced functionality

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2014 - 2018

CERTIFICATIONS
• AWS Certified Developer - Associate
• MongoDB Certified Developer`;

    this.rewriteData.improvements = [
      {
        section: 'Summary',
        change: 'Added industry-specific keywords and quantified achievements',
        impact: 'High'
      },
      {
        section: 'Experience',
        change: 'Enhanced action verbs and added measurable metrics',
        impact: 'High'
      },
      {
        section: 'Skills',
        change: 'Aligned skills with job requirements and organized by category',
        impact: 'Medium'
      },
      {
        section: 'Formatting',
        change: 'Optimized for ATS with standard headers and clean structure',
        impact: 'Medium'
      }
    ];
  }

  downloadRewrittenCv(): void {
    if (!this.rewriteData.rewrittenCv) return;

    const blob = new Blob([this.rewriteData.rewrittenCv], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rewritten-cv.txt';
    link.click();
    window.URL.revokeObjectURL(url);

    this.showSuccess('CV downloaded successfully');
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
