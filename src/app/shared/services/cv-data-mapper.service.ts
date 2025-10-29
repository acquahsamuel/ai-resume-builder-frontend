import { Injectable } from '@angular/core';
import { StandardCvData, PersonalDetails, Experience, Education, Skill, Language } from '../models/cv-data.model';
import { ITemplate, HeaderProfileInfo, ProfessionalSummary } from '../dto/templates.dto';

/**
 * CV Data Mapper Service
 * Handles transformation between different CV data formats:
 * - Form data -> Standard CV Data
 * - Standard CV Data -> Template format (ITemplate)
 * - API response -> Standard CV Data
 */
@Injectable({
  providedIn: 'root'
})
export class CvDataMapperService {

  /**
   * Convert Standard CV Data to Template format (ITemplate)
   * This ensures all templates receive data in a consistent format
   */
  mapToTemplateFormat(cvData: StandardCvData, templateId: string = 'sunshine'): ITemplate {
    return {
      templateId,
      HeaderProfileInfo: this.mapPersonalDetails(cvData.personalDetails),
      ProfessionalSummary: this.mapSummary(cvData.summary),
      Experience: this.mapExperiences(cvData.experience || []),
      Education: this.mapEducations(cvData.education || []),
      Skills: this.mapSkills(cvData.skills || []),
      Languages: this.mapLanguages(cvData.languages || []),
      Projects: this.mapProjects(cvData.projects || []),
      Certifications: this.mapCertifications(cvData.certifications || []),
      Hobbies: this.mapHobbies(cvData.hobbies || []),
      AdditionalSections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Map Personal Details to HeaderProfileInfo format
   */
  private mapPersonalDetails(personalDetails?: PersonalDetails): HeaderProfileInfo {
    if (!personalDetails) {
      return this.getEmptyHeaderProfileInfo();
    }

    const firstname = personalDetails.firstname || '';
    const lastname = personalDetails.surname || personalDetails.lastname || '';
    const fullname = personalDetails.fullname || 
                    `${firstname} ${lastname}`.trim() || 
                    `${personalDetails.firstname || ''} ${personalDetails.surname || ''}`.trim();

    return {
      firstname,
      lastname,
      othername: personalDetails.othername || '',
      fullname,
      title: personalDetails.title || '',
      email: personalDetails.email || '',
      phone: personalDetails.phoneNumber || personalDetails.phone || '',
      address: personalDetails.address || '',
      city: personalDetails.city || '',
      country: personalDetails.country || '',
      postalCode: personalDetails.postalCode || '',
      dateOfBirth: personalDetails.dateOfBirth,
      socialMedia: personalDetails.socialMedia || []
    };
  }

  /**
   * Map Summary to ProfessionalSummary format
   */
  private mapSummary(summary?: { summary?: string; content?: string }): ProfessionalSummary {
    return {
      summary: summary?.summary || summary?.content || ''
    };
  }

  /**
   * Map Experiences to Template format
   */
  private mapExperiences(experiences: Experience[]): ITemplate['Experience'] {
    return experiences.map(exp => ({
      company: exp.employerName || exp.company || '',
      position: exp.jobTitle || exp.position || '',
      startDate: this.formatDate(exp.startYear || exp.startDate || ''),
      endDate: exp.currentlyHere 
        ? 'Present' 
        : this.formatDate(exp.endYear || exp.endDate || ''),
      description: exp.summary || exp.description || '',
      responsibilities: exp.responsibilities || []
    }));
  }

  /**
   * Map Educations to Template format
   */
  private mapEducations(educations: Education[]): ITemplate['Education'] {
    return educations.map(edu => ({
      institution: edu.schoolName || edu.institution || '',
      degree: edu.degreeName || edu.degree || '',
      fieldOfStudy: edu.major || edu.fieldOfStudy || '',
      city: edu.city || '',
      country: edu.country || '',
      startDate: this.formatDate(edu.startYear || edu.startDate || ''),
      endDate: edu.currentlyEnrolled
        ? 'Present'
        : this.formatDate(edu.endYear || edu.endDate || '')
    }));
  }

  /**
   * Map Skills to Template format
   */
  private mapSkills(skills: Skill[]): ITemplate['Skills'] {
    return skills.map(skill => ({
      skill: skill.skillName || skill.skill || '',
      proficiency: skill.proficiency || '',
      level: skill.level || 0
    }));
  }

  /**
   * Map Languages to Template format
   */
  private mapLanguages(languages: Language[]): ITemplate['Languages'] {
    return languages.map(lang => ({
      language: lang.language || '',
      proficiency: lang.proficiency || ''
    }));
  }

  /**
   * Map Projects to Template format
   */
  private mapProjects(projects: StandardCvData['projects']): ITemplate['Projects'] {
    return (projects || []).map(project => ({
      title: project.title || '',
      description: project.description || '',
      technologies: project.technologies || [],
      link: project.link || project.url || ''
    }));
  }

  /**
   * Map Certifications to Template format
   */
  private mapCertifications(certifications: StandardCvData['certifications']): ITemplate['Certifications'] {
    return (certifications || []).map(cert => ({
      name: cert.name || '',
      issuingOrganization: cert.issuingOrganization || '',
      issueDate: cert.issueDate || '',
      summary: cert.summary,
      expirationDate: cert.expirationDate,
      credentialId: cert.credentialId
    }));
  }

  /**
   * Map Hobbies to Template format
   */
  private mapHobbies(hobbies: StandardCvData['hobbies']): ITemplate['Hobbies'] {
    const hobbyArray = (hobbies || []).map(h => h.name || h.hobby || '').filter(Boolean);
    // ITemplate expects Hobbies[] which is an array of objects with hobby property
    return hobbyArray.map(hobby => ({ hobby })) as any;
  }

  /**
   * Normalize form data to Standard CV Data format
   * This handles various form input formats and normalizes them
   */
  normalizeFormData(formData: any): StandardCvData {
    return {
      personalDetails: formData.personalDetails || formData.PersonalDetails,
      summary: formData.summary || formData.Summary,
      experience: formData.experience || formData.experienceRecords || formData.Experience,
      education: formData.education || formData.educationRecords || formData.Education,
      skills: formData.skills || formData.Skills,
      languages: formData.languages || formData.Languages,
      projects: formData.projects || formData.Project,
      certifications: formData.certifications || formData.Certifications,
      references: formData.references || formData.References,
      hobbies: formData.hobbies || formData.Hobbies,
      courses: formData.courses || formData.Courses,
      publications: formData.publications || formData.Publications,
      extraActivities: formData.extraActivities || formData.ExtraCurricularActivities
    };
  }

  /**
   * Format date to template format
   */
  private formatDate(date: string | number): string {
    if (!date) return '';
    if (typeof date === 'number') {
      return date.toString();
    }
    return date;
  }

  /**
   * Get empty HeaderProfileInfo
   */
  private getEmptyHeaderProfileInfo(): HeaderProfileInfo {
    return {
      firstname: '',
      lastname: '',
      othername: '',
      fullname: '',
      title: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      socialMedia: []
    };
  }
}

