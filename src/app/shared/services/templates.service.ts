import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ITemplateRequest, ITemplateResponse } from '../dto/templates.dto';

@Injectable({
  providedIn: 'root',
})
export class TemplatesService {
  private BASE_URL = `${environment.BASE_URL}`;

  constructor(private http: HttpClient) {}

  /**
   * Get authentication headers with Bearer token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('currentUser');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  /**
   * Get HTTP options with authentication
   */
  private getHttpOptions() {
    return {
      headers: this.getAuthHeaders(),
    };
  }

  /**
   * Create a new template
   * POST /api/v1/template
   */
  createTemplate(template: ITemplateRequest): Observable<ITemplateResponse> {
    return this.http.post<ITemplateResponse>(
      `${this.BASE_URL}/template`,
      template,
      this.getHttpOptions()
    );
  }

  /**
   * Get all templates
   * GET /api/v1/template
   */
  getAllTemplates(): Observable<ITemplateResponse[]> {
    return this.http.get<ITemplateResponse[]>(
      `${this.BASE_URL}/template`,
      this.getHttpOptions()
    );
  }

  /**
   * Get a specific template by ID
   * GET /api/v1/template/:id
   */
  getTemplateById(id: string): Observable<ITemplateResponse> {
    return this.http.get<ITemplateResponse>(
      `${this.BASE_URL}/template/${id}`,
      this.getHttpOptions()
    );
  }

  /**
   * Update a template (partial update supported)
   * PATCH /api/v1/template/:id
   */
  updateTemplate(id: string, template: Partial<ITemplateRequest>): Observable<ITemplateResponse> {
    return this.http.patch<ITemplateResponse>(
      `${this.BASE_URL}/template/${id}`,
      template,
      this.getHttpOptions()
    );
  }

  /**
   * Delete a template
   * DELETE /api/v1/template/:id
   */
  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.BASE_URL}/template/${id}`,
      this.getHttpOptions()
    );
  }

  /**
   * Update template statistics (for public templates)
   * PATCH /api/v1/template/:id
   */
  updateTemplateStatistics(
    id: string,
    statistics: {
      views?: number;
      downloads?: number;
      lastViewedAt?: string;
      lastDownloadedAt?: string;
    }
  ): Observable<ITemplateResponse> {
    return this.http.patch<ITemplateResponse>(
      `${this.BASE_URL}/template/${id}`,
      { statistics },
      this.getHttpOptions()
    );
  }
}

