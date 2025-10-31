import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { StandardCvData, PersonalDetails, Summary, Experience, Education, Skill, Language, Project, Certification, Reference, Hobby, Course, Publication, ExtraActivity } from '../models/cv-data.model';
// import { CvDataMapperService } from './cv-data-mapper.service';

// Export StandardCvData as CvData for backward compatibility
export type CvData = StandardCvData;

/**
 * CV Content Service
 * Central service for managing CV data throughout the application
 * Uses StandardCvData as the canonical format
 * This is the single source of truth for CV data
 */
@Injectable({
  providedIn: 'root'
})
export class CvContentService {
  private apiUrl = `${environment.BASE_URL}/cvs`;

  // Using BehaviorSubject for real-time updates with standardized format
  private cvDataSubject = new BehaviorSubject<StandardCvData>({});
  public cvData$ = this.cvDataSubject.asObservable();

  // Current CV data state
  private currentCvData: StandardCvData = {};

  dataSignal = signal<StandardCvData | null>(null);

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Fetch profile data from API
   * Normalizes the response to StandardCvData format
   */
  fetchProfileData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  /**
   * Update personal details section
   */
  updatePersonalDetails(personalDetails: PersonalDetails): void {
    this.currentCvData.personalDetails = { ...this.currentCvData.personalDetails, ...personalDetails };
    this.emitUpdate();
  }

  /**
   * Update summary section
   */
  updateSummary(summary: Summary): void {
    this.currentCvData.summary = summary;
    this.emitUpdate();
  }

  /**
   * Update experience section
   */
  updateExperience(experience: Experience[]): void {
    this.currentCvData.experience = experience;
    this.emitUpdate();
  }

  /**
   * Update education section
   */
  updateEducation(education: Education[]): void {
    this.currentCvData.education = education;
    this.emitUpdate();
  }

  /**
   * Update skills section
   */
  updateSkills(skills: Skill[]): void {
    this.currentCvData.skills = skills;
    this.emitUpdate();
  }

  /**
   * Update languages section
   */
  updateLanguages(languages: Language[]): void {
    this.currentCvData.languages = languages;
    this.emitUpdate();
  }

  /**
   * Update projects section
   */
  updateProjects(projects: Project[]): void {
    this.currentCvData.projects = projects;
    this.emitUpdate();
  }

  /**
   * Update certifications section
   */
  updateCertifications(certifications: Certification[]): void {
    this.currentCvData.certifications = certifications;
    this.emitUpdate();
  }

  /**
   * Update references section
   */
  updateReferences(references: Reference[]): void {
    this.currentCvData.references = references;
    this.emitUpdate();
  }

  /**
   * Update hobbies section
   */
  updateHobbies(hobbies: Hobby[]): void {
    this.currentCvData.hobbies = hobbies;
    this.emitUpdate();
  }

  /**
   * Update courses section
   */
  updateCourses(courses: Course[]): void {
    this.currentCvData.courses = courses;
    this.emitUpdate();
  }

  /**
   * Update publications section
   */
  updatePublications(publications: Publication[]): void {
    this.currentCvData.publications = publications;
    this.emitUpdate();
  }

  /**
   * Update extra activities section
   */
  updateExtraActivities(extraActivities: ExtraActivity[]): void {
    this.currentCvData.extraActivities = extraActivities;
    this.emitUpdate();
  }

  /**
   * Update entire CV data (used for initialization or bulk updates)
   */
  updateCvData(cvData: Partial<StandardCvData>): void {
    this.currentCvData = { ...this.currentCvData, ...cvData };
    this.emitUpdate();
  }

  /**
   * Get current CV data snapshot
   */
  getCurrentCvData(): StandardCvData {
    return { ...this.currentCvData };
  }

  /**
   * Emit updated CV data to all subscribers
   */
  private emitUpdate(): void {
    this.cvDataSubject.next({ ...this.currentCvData });
    this.dataSignal.set({ ...this.currentCvData });
  }
}
