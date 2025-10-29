import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../../../shared/modules/primeNg.module';

@Component({
    selector: 'app-ats-analysis',
    templateUrl: './ats-analysis.component.html',
    styleUrls: ['./ats-analysis.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, PrimeNgModule]
})
export class AtsAnalysisComponent implements OnInit {
  activeTabIndex = 0;

  // Tab 1: CV Only Analysis
  cvOnly = {
    uploadedFileName: '',
    uploadedFileSize: '',
    overallScore: 0,
    analysisResults: {
      keywordCount: 0,
      skillsIdentified: [] as string[],
      formattingScore: 0,
      recommendations: [] as any[]
    }
  };

  // Tab 2: Job Description & CV Compare (existing functionality)
  jobDescription = '';
  uploadedFileName = '';
  uploadedFileSize = '';
  overallScore = 78;
  maxScore = 100;

  jobKeywords = [
    { word: 'JavaScript', matched: true, importance: 'high' },
    { word: 'React', matched: true, importance: 'high' },
    { word: 'Node.js', matched: true, importance: 'high' },
    { word: 'TypeScript', matched: true, importance: 'medium' },
    { word: 'Git', matched: true, importance: 'medium' },
    { word: 'REST API', matched: true, importance: 'high' },
    { word: 'Agile', matched: true, importance: 'medium' },
    { word: 'AWS', matched: false, importance: 'high' },
    { word: 'Docker', matched: false, importance: 'medium' },
    { word: 'CI/CD', matched: false, importance: 'medium' },
  ];

  requiredSkills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'AWS'];
  resumeSkills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'MongoDB', 'Express.js'];

  requiredExperience = 5;
  actualExperience = 6;

  requiredEducation = "Bachelor's degree in Computer Science or related field";
  actualEducation = "Bachelor's degree in Computer Science";

  formattingIssues = [
    { type: 'Header', issue: 'Missing proper section headings', severity: 'medium' },
    { type: 'Dates', issue: 'Inconsistent date formats', severity: 'low' },
    { type: 'Font', issue: 'Using decorative fonts in headers', severity: 'low' },
  ];

  recommendations = [
    {
      priority: 'high',
      title: 'Add Missing Keywords',
      description: 'Include "AWS", "Docker", and "CI/CD" to improve keyword matching',
      impact: '+12 points'
    },
    {
      priority: 'medium',
      title: 'Improve Keyword Density',
      description: 'Key skills should appear 2-3 times throughout your resume',
      impact: '+5 points'
    },
    {
      priority: 'medium',
      title: 'Add More Action Verbs',
      description: 'Use strong action verbs like "Architected", "Optimized", "Implemented"',
      impact: '+3 points'
    },
    {
      priority: 'low',
      title: 'Standardize Formatting',
      description: 'Use consistent formatting for better ATS parsing',
      impact: '+2 points'
    },
  ];

  // Tab 3: CV Rewrite
  cvRewrite = {
    jobDescription: '',
    uploadedFileName: '',
    uploadedFileSize: '',
    originalCv: '',
    rewrittenCv: '',
    improvements: [] as any[],
    isProcessing: false
  };

  constructor() { }

  ngOnInit(): void {
    this.jobDescription = '';
  }

  // File Upload Methods
  onFileSelected(event: any, tab: 'cvOnly' | 'compare' | 'rewrite' = 'compare') {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileSize = this.formatFileSize(file.size);
      
      if (tab === 'cvOnly') {
        this.cvOnly.uploadedFileName = fileName;
        this.cvOnly.uploadedFileSize = fileSize;
        this.analyzeCvOnly();
      } else if (tab === 'rewrite') {
        this.cvRewrite.uploadedFileName = fileName;
        this.cvRewrite.uploadedFileSize = fileSize;
      } else {
        this.uploadedFileName = fileName;
        this.uploadedFileSize = fileSize;
      }
    }
  }

  removeFile(tab: 'cvOnly' | 'compare' | 'rewrite' = 'compare') {
    if (tab === 'cvOnly') {
      this.cvOnly.uploadedFileName = '';
      this.cvOnly.uploadedFileSize = '';
    } else if (tab === 'rewrite') {
      this.cvRewrite.uploadedFileName = '';
      this.cvRewrite.uploadedFileSize = '';
    } else {
      this.uploadedFileName = '';
      this.uploadedFileSize = '';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Tab 1: Analyze CV Only
  analyzeCvOnly() {
    if (!this.cvOnly.uploadedFileName) return;
    // Simulate analysis
    this.cvOnly.overallScore = 72;
    this.cvOnly.analysisResults = {
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

  // Tab 2: Analyze Resume with Job Description
  analyzeResume() {
    if (!this.jobDescription) return;
    console.log('Analyzing resume...');
    this.overallScore = 78;
  }

  // Tab 3: Rewrite CV
  rewriteCv() {
    if (!this.cvRewrite.jobDescription || !this.cvRewrite.uploadedFileName) return;
    
    this.cvRewrite.isProcessing = true;
    
    // Simulate API call
    setTimeout(() => {
      this.cvRewrite.rewrittenCv = 'Your optimized CV will appear here...';
      this.cvRewrite.improvements = [
        {
          section: 'Summary',
          change: 'Added industry-specific keywords',
          impact: 'High'
        },
        {
          section: 'Experience',
          change: 'Enhanced action verbs and quantified achievements',
          impact: 'High'
        },
        {
          section: 'Skills',
          change: 'Aligned skills with job requirements',
          impact: 'Medium'
        }
      ];
      this.cvRewrite.isProcessing = false;
    }, 2000);
  }

  // Drag and Drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, tab: 'cvOnly' | 'compare' | 'rewrite' = 'compare') {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileName = file.name;
      const fileSize = this.formatFileSize(file.size);
      
      if (tab === 'cvOnly') {
        this.cvOnly.uploadedFileName = fileName;
        this.cvOnly.uploadedFileSize = fileSize;
        this.analyzeCvOnly();
      } else if (tab === 'rewrite') {
        this.cvRewrite.uploadedFileName = fileName;
        this.cvRewrite.uploadedFileSize = fileSize;
      } else {
        this.uploadedFileName = fileName;
        this.uploadedFileSize = fileSize;
      }
    }
  }

  triggerFileInput(tab: 'cvOnly' | 'compare' | 'rewrite' = 'compare') {
    const inputId = `file-input-${tab}`;
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    fileInput?.click();
  }

  getScoreColor(score: number = this.overallScore) {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  getScoreBgColor(score: number = this.overallScore) {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  }

  getImportanceColor(importance: string) {
    switch(importance) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getMatchedSkills() {
    return this.requiredSkills.filter(skill => 
      this.resumeSkills.some(resumeSkill => resumeSkill.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  getMissingSkills() {
    return this.requiredSkills.filter(skill => 
      !this.resumeSkills.some(resumeSkill => resumeSkill.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  getMatchedKeywords() {
    return this.jobKeywords.filter(k => k.matched);
  }

  getUnmatchedKeywords() {
    return this.jobKeywords.filter(k => !k.matched);
  }

  getMatchedKeywordsCount() {
    return this.getMatchedKeywords().length;
  }

  getTotalKeywordsCount() {
    return this.jobKeywords.length;
  }
}
