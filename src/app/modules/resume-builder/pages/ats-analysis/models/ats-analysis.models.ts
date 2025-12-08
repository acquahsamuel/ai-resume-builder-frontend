export interface FileUploadInfo {
  fileName: string;
  fileSize: string;
  file?: File;
}

// Parsed analysis sections from API response
export interface ParsedAnalysisSection {
  title: string;
  content: string;
  items?: string[];
}

export interface CVAnalysisResult {
  overallScore: number;
  rawAnalysis: string; // Full markdown text from API
  sections: ParsedAnalysisSection[]; // Parsed sections
  recommendations: Recommendation[];
  keywordCount?: number;
  skillsIdentified: string[];
  formattingScore?: number;
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

export interface ComparisonResult {
  matches: string[];
  gaps: string[];
  recommendations: string[];
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
  comparisonResult?: ComparisonResult;
  rawAnalysis?: string;
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
