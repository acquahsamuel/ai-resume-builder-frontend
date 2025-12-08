import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

// Request/Response Interfaces
export interface ChatRequest {
  message: string;
}

export interface KeywordsRequest {
  cv_file?: File;
  cv_text?: string;
  top_n?: number;
}

export interface RewriteRequest {
  cv_file?: File;
  cv_text?: string;
  jd_file?: File;
  jd_text?: string;
  focus_areas?: string;
}

export interface CVAnalysisRequest {
  cv_file?: File;
  cv_text?: string;
  jd_file?: File;
  jd_text?: string;
  prompt?: string;
}

export interface CVParseRequest {
  cv_file?: File;
  cv_text?: string;
}

export interface ATSScoreRequest {
  cv_file?: File;
  cv_text?: string;
  jd_file?: File;
  jd_text?: string;
}

export interface CompareRequest {
  cv_file?: File;
  cv_text?: string;
  jd_file?: File;
  jd_text?: string;
}

export interface AnalyzeIssuesRequest {
  cv_file?: File;
  cv_text?: string;
}

export interface ImprovementPlanRequest {
  cv_file?: File;
  cv_text?: string;
}

export interface BaseResponse {
  success: boolean;
  cv_input_type?: "file" | "text";
  cv_filename?: string;
  jd_input_type?: "file" | "text" | null;
  jd_filename?: string;
}

export interface HealthResponse {
  status: string;
  agent_initialized: boolean;
}

export interface AnalyzeResponse extends BaseResponse {
  analysis: string;
}

export interface ParseResponse extends BaseResponse {
  parsed_data: any;
}

export interface ATSScoreResponse extends BaseResponse {
  ats_evaluation: {
    score: number;
    details: string;
    recommendations?: string[];
  };
}

export interface CompareResponse extends BaseResponse {
  comparison: {
    matches: string[];
    gaps: string[];
    recommendations: string[];
  };
}

export interface KeywordsResponse extends BaseResponse {
  keywords: string[];
}

export interface IssuesResponse extends BaseResponse {
  issues: {
    critical?: string[];
    major?: string[];
    minor?: string[];
  };
}

export interface RewriteResponse extends BaseResponse {
  rewritten_cv: string;
}

export interface ImprovementPlanResponse extends BaseResponse {
  improvement_plan: {
    priority: string;
    actions: string[];
    timeline?: string;
  };
}

export interface ChatResponse {
  response: string;
}

export interface ErrorResponse {
  detail: string;
}

@Injectable({
  providedIn: "root"
})
export class CvParserService {
  private CV_PARSER_BASE_URL = environment.CV_PARSER_API_URL;

  constructor(private http: HttpClient) {}

  /**
   * Get authentication headers with Bearer token (if needed)
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("currentUser");
    const headers: any = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return new HttpHeaders(headers);
  }

  /**
   * Create FormData from request object
   */
  private createFormData(request: any): FormData {
    const formData = new FormData();

    Object.keys(request).forEach(key => {
      const value = request[key];
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return formData;
  }

  /**
   * 1. Health Check
   * GET /health
   * Check if the CV parser agent is initialized and healthy.
   */
  healthCheck(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.CV_PARSER_BASE_URL}/health`);
  }

  /**
   * 2. Analyze CV
   * POST /analyze
   * Comprehensive CV analysis with customizable prompts.
   * Supports CV file/text and optional JD file/text with custom prompts.
   */
  analyzeCV(request: CVAnalysisRequest): Observable<AnalyzeResponse> {
    const formData = this.createFormData(request);

    return this.http.post<AnalyzeResponse>(
      `${this.CV_PARSER_BASE_URL}/analyze`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * 3. Chat
   * POST /chat
   * General conversational interaction with the agent.
   */
  chat(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(
      `${this.CV_PARSER_BASE_URL}/chat`,
      request,
      {
        headers: this.getAuthHeaders().set("Content-Type", "application/json")
      }
    );
  }

  /**
   * 4. Parse CV
   * POST /parse
   * Extract structured information from a CV.
   */
  parseCV(request: CVParseRequest): Observable<ParseResponse> {
    const formData = this.createFormData(request);

    return this.http.post<ParseResponse>(
      `${this.CV_PARSER_BASE_URL}/parse`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * 5. ATS Score Evaluation
   * POST /ats-score
   * Evaluate ATS (Applicant Tracking System) compatibility score.
   */
  getATSScore(request: ATSScoreRequest): Observable<ATSScoreResponse> {
    const formData = this.createFormData(request);

    return this.http.post<ATSScoreResponse>(
      `${this.CV_PARSER_BASE_URL}/ats-score`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * 6. Compare CV with Job Description
   * POST /compare
   * Compare CV against a job description to identify matches and gaps.
   * Requires at least one CV input AND one JD input.
   */
  compareWithJobDescription(request: CompareRequest): Observable<CompareResponse> {
    const formData = this.createFormData(request);

    return this.http.post<CompareResponse>(
      `${this.CV_PARSER_BASE_URL}/compare`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * 7. Extract Keywords
   * POST /keywords
   * Extract important keywords from a CV.
   */
  extractKeywords(request: KeywordsRequest): Observable<KeywordsResponse> {
    const formData = this.createFormData(request);

    return this.http.post<KeywordsResponse>(
      `${this.CV_PARSER_BASE_URL}/keywords`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * 8. Analyze Issues
   * POST /analyze-issues
   * Analyze CV for issues categorized by severity.
   */
  analyzeIssues(request: AnalyzeIssuesRequest): Observable<IssuesResponse> {
    const formData = this.createFormData(request);

    return this.http.post<IssuesResponse>(
      `${this.CV_PARSER_BASE_URL}/analyze-issues`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * 9. Rewrite CV
   * POST /rewrite
   * Generate an improved, ATS-optimized version of the CV.
   */
  rewriteCV(request: RewriteRequest): Observable<RewriteResponse> {
    const formData = this.createFormData(request);

    return this.http.post<RewriteResponse>(
      `${this.CV_PARSER_BASE_URL}/rewrite`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * 10. Generate Improvement Plan
   * POST /improvement-plan
   * Create a prioritized, actionable improvement roadmap for a CV.
   */
  generateImprovementPlan(request: ImprovementPlanRequest): Observable<ImprovementPlanResponse> {
    const formData = this.createFormData(request);

    return this.http.post<ImprovementPlanResponse>(
      `${this.CV_PARSER_BASE_URL}/improvement-plan`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Convenience methods for common use cases

  /**
   * Analyze CV file only
   */
  analyzeCVFile(file: File): Observable<AnalyzeResponse> {
    return this.analyzeCV({ cv_file: file });
  }

  /**
   * Analyze CV text only
   */
  analyzeCVText(text: string): Observable<AnalyzeResponse> {
    return this.analyzeCV({ cv_text: text });
  }

  /**
   * Analyze CV file with JD text
   */
  analyzeCVWithJDText(cvFile: File, jdText: string): Observable<AnalyzeResponse> {
    return this.analyzeCV({ cv_file: cvFile, jd_text: jdText });
  }

  /**
   * Parse CV file
   */
  parseCVFile(file: File): Observable<ParseResponse> {
    return this.parseCV({ cv_file: file });
  }

  /**
   * Parse CV text
   */
  parseCVText(text: string): Observable<ParseResponse> {
    return this.parseCV({ cv_text: text });
  }

  /**
   * Get ATS score for CV file
   */
  getATSScoreForFile(cvFile: File, jdText?: string): Observable<ATSScoreResponse> {
    const request: ATSScoreRequest = { cv_file: cvFile };
    if (jdText) {
      request.jd_text = jdText;
    }
    return this.getATSScore(request);
  }

  /**
   * Compare CV file with JD text
   */
  compareCVFileWithJDText(cvFile: File, jdText: string): Observable<CompareResponse> {
    return this.compareWithJobDescription({ cv_file: cvFile, jd_text: jdText });
  }

  /**
   * Extract keywords from CV file
   */
  extractKeywordsFromFile(file: File, topN: number = 25): Observable<KeywordsResponse> {
    return this.extractKeywords({ cv_file: file, top_n: topN });
  }

  /**
   * Rewrite CV file
   */
  rewriteCVFile(cvFile: File, jdText?: string, focusAreas?: string): Observable<RewriteResponse> {
    const request: RewriteRequest = { cv_file: cvFile };
    if (jdText) {
      request.jd_text = jdText;
    }
    if (focusAreas) {
      request.focus_areas = focusAreas;
    }
    return this.rewriteCV(request);
  }
}
