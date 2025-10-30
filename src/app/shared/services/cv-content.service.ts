import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { StandardCvData } from '../models/cv-data.model';
import { CvDataMapperService } from './cv-data-mapper.service';

// Export StandardCvData as CvData for backward compatibility
export type CvData = StandardCvData;

/**
 * CV Content Service
 * Central service for managing CV data throughout the application
 * Uses StandardCvData as the canonical format
 */
@Injectable({
  providedIn: 'root'
})
export class CvContentService {
  private apiUrl = `${environment.BASE_URL}/cvs`;

  // Using BehaviorSubject for real-time updates with standardized format
  private cvDataSubject = new BehaviorSubject<StandardCvData>({});
  public cvData$ = this.cvDataSubject.asObservable();

  dataSignal = signal<StandardCvData | null>(null);

  constructor(
    private http: HttpClient,
    private mapper: CvDataMapperService
  ) {}

  /**
   * Fetch profile data from API
   * Normalizes the response to StandardCvData format
   */
  fetchProfileData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  /**
   * Update CV data with normalized form data
   */
  updateCvData(data: Partial<StandardCvData>): void {
    const current = this.cvDataSubject.value;
    const normalized = this.mapper.normalizeFormData(data);
    this.cvDataSubject.next({ ...current, ...normalized });
    this.dataSignal.set({ ...current, ...normalized });
  }

  /**
   * Update Personal Details section
   */
  updatePersonalDetails(data: any): void {
    const current = this.cvDataSubject.value;
    const normalized = this.mapper.normalizeFormData({ personalDetails: data });
    this.cvDataSubject.next({ ...current, personalDetails: normalized.personalDetails });
    this.dataSignal.set({ ...current, personalDetails: normalized.personalDetails });
  }

  /**
   * Update Summary section
   */
  updateSummary(data: any): void {
    const current = this.cvDataSubject.value;
    const normalized = this.mapper.normalizeFormData({ summary: data });
    this.cvDataSubject.next({ ...current, summary: normalized.summary });
    this.dataSignal.set({ ...current, summary: normalized.summary });
  }

  /**
   * Update Experience section
   */
  updateExperience(data: any): void {
    const current = this.cvDataSubject.value;
    // Handle both array and object with array property (like experienceRecords)
    const experiences = Array.isArray(data) ? data : (data?.experienceRecords || data?.experience || []);
    const normalized = this.mapper.normalizeFormData({ experience: experiences });
    this.cvDataSubject.next({ ...current, experience: normalized.experience });
    this.dataSignal.set({ ...current, experience: normalized.experience });
  }

  /**
   * Update Education section
   */
  updateEducation(data: any): void {
    const current = this.cvDataSubject.value;
    // Handle both array and object with array property (like educationRecords)
    const educations = Array.isArray(data) ? data : (data?.educationRecords || data?.education || []);
    const normalized = this.mapper.normalizeFormData({ education: educations });
    this.cvDataSubject.next({ ...current, education: normalized.education });
    this.dataSignal.set({ ...current, education: normalized.education });
  }

  /**
   * Update Skills section
   */
  updateSkills(data: any): void {
    const current = this.cvDataSubject.value;
    const normalized = this.mapper.normalizeFormData({ skills: data });
    this.cvDataSubject.next({ ...current, skills: normalized.skills });
    this.dataSignal.set({ ...current, skills: normalized.skills });
  }

  /**
   * Update Languages section
   */
  updateLanguages(data: any): void {
    const current = this.cvDataSubject.value;
    const normalized = this.mapper.normalizeFormData({ languages: data });
    this.cvDataSubject.next({ ...current, languages: normalized.languages });
    this.dataSignal.set({ ...current, languages: normalized.languages });
  }

  /**
   * Get current CV data in standardized format
   */
  getCvData(): StandardCvData {
    return this.cvDataSubject.value;
  }

  /**
   * Get CV data in template format (ITemplate)
   * Useful when passing data to template components
   */
  getCvDataForTemplate(templateId: string = 'sunshine'): any {
    const cvData = this.getCvData();
    return this.mapper.mapToTemplateFormat(cvData, templateId);
  }
}
