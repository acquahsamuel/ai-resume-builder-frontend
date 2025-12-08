export interface FileUploadInfo {
  fileName: string;
  fileSize: string;
  file?: File;
}

export interface CVAnalysisResult {
  keywordCount: number;
  skillsIdentified: string[];
  formattingScore: number;
  recommendations: Recommendation[];
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
}

export interface JobKeyword {
  word: string;
  matched: boolean;
  importance: 'high' | 'medium' | 'low';
}

export interface Improvement {
  section: string;
  change: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface FormattingIssue {
  type: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
}

export interface CVOnlyData {
  uploadedFile?: FileUploadInfo;
  overallScore: number;
  analysisResults: CVAnalysisResult;
  isLoading: boolean;
}

export interface JobMatchData {
  jobDescription: string;
  uploadedFile?: FileUploadInfo;
  overallScore: number;
  jobKeywords: JobKeyword[];
  requiredSkills: string[];
  resumeSkills: string[];
  recommendations: Recommendation[];
  isLoading: boolean;
}

export interface CVRewriteData {
  jobDescription: string;
  uploadedFile?: FileUploadInfo;
  originalCv: string;
  rewrittenCv: string;
  improvements: Improvement[];
  isProcessing: boolean;
}
