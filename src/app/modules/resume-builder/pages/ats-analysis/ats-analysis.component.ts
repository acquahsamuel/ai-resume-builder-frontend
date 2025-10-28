import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-ats-analysis',
    templateUrl: './ats-analysis.component.html',
    styleUrls: ['./ats-analysis.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class AtsAnalysisComponent implements OnInit {

  // Job Description
  jobDescription = '';
  
  // File Upload
  uploadedFileName = '';
  uploadedFileSize = '';
  
  // Mock ATS Score
  overallScore = 78;
  maxScore = 100;

  // Job Description Keywords
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

  // Skills Analysis
  requiredSkills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'AWS'];
  resumeSkills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'MongoDB', 'Express.js'];

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

  // Experience Matching
  requiredExperience = 5;
  actualExperience = 6;

  // Education Check
  requiredEducation = "Bachelor's degree in Computer Science or related field";
  actualEducation = "Bachelor's degree in Computer Science";

  // Formatting Issues
  formattingIssues = [
    { type: 'Header', issue: 'Missing proper section headings', severity: 'medium' },
    { type: 'Dates', issue: 'Inconsistent date formats', severity: 'low' },
    { type: 'Font', issue: 'Using decorative fonts in headers', severity: 'low' },
  ];

  // ATS Recommendations
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

  constructor() { }

  ngOnInit(): void {
    // Initialize with sample data
    this.jobDescription = 'We are looking for a Senior Software Engineer with expertise in JavaScript, React, and Node.js. The ideal candidate should have 5+ years of experience in full-stack development, strong knowledge of TypeScript, REST APIs, Git, and experience with cloud platforms like AWS. Knowledge of Docker and CI/CD pipelines is a plus.';
  }

  // File Upload Methods
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFileName = file.name;
      this.uploadedFileSize = this.formatFileSize(file.size);
    }
  }

  removeFile() {
    this.uploadedFileName = '';
    this.uploadedFileSize = '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Analyze Resume
  analyzeResume() {
    if (!this.jobDescription) return;
    // In a real app, this would call an API
    console.log('Analyzing resume...');
    // Simulate analysis
    this.overallScore = 78;
  }

  // Drag and Drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.uploadedFileName = file.name;
      this.uploadedFileSize = this.formatFileSize(file.size);
    }
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  getScoreColor() {
    if (this.overallScore >= 80) return 'text-green-600';
    if (this.overallScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  getScoreBgColor() {
    if (this.overallScore >= 80) return 'bg-green-100';
    if (this.overallScore >= 60) return 'bg-yellow-100';
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
