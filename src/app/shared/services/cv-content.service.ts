import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal, computed } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

export interface CvData {
  personalDetails?: any;
  summary?: any;
  experience?: any[];
  education?: any[];
  skills?: any[];
  languages?: any[];
  references?: any[];
  hobbies?: any[];
  courses?: any[];
  publications?: any[];
  projects?: any[];
  extraActivities?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class CvContentService {
  private apiUrl = `${environment.BASE_URL}/cv/2`;

  // Using BehaviorSubject for real-time updates
  private cvDataSubject = new BehaviorSubject<CvData>({});
  public cvData$ = this.cvDataSubject.asObservable();

  dataSignal = signal<any | null>(null);

  constructor(private http: HttpClient) {}

  fetchProfileData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Update CV data sections
  updatePersonalDetails(data: any) {
    const current = this.cvDataSubject.value;
    this.cvDataSubject.next({ ...current, personalDetails: data });
  }

  updateSummary(data: any) {
    const current = this.cvDataSubject.value;
    this.cvDataSubject.next({ ...current, summary: data });
  }

  updateExperience(data: any) {
    const current = this.cvDataSubject.value;
    this.cvDataSubject.next({ ...current, experience: data });
  }

  updateEducation(data: any) {
    const current = this.cvDataSubject.value;
    this.cvDataSubject.next({ ...current, education: data });
  }

  updateSkills(data: any) {
    const current = this.cvDataSubject.value;
    this.cvDataSubject.next({ ...current, skills: data });
  }

  updateLanguages(data: any) {
    const current = this.cvDataSubject.value;
    this.cvDataSubject.next({ ...current, languages: data });
  }

  // Get current CV data
  getCvData(): CvData {
    return this.cvDataSubject.value;
  }
}
