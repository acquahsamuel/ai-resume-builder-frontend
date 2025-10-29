/**
 * Standardized CV Data Model
 * This is the canonical format for CV data used throughout the application
 */

export interface PersonalDetails {
  firstname?: string;
  lastname?: string;
  surname?: string;
  othername?: string;
  fullname?: string;
  title?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: string;
  socialMedia?: Array<{
    platform: string;
    link: string;
  }>;
}

export interface Summary {
  summary?: string;
  content?: string;
}

export interface Experience {
  // Form data format
  jobTitle?: string;
  employerName?: string;
  company?: string;
  position?: string;
  startYear?: string | number;
  endYear?: string | number;
  startDate?: string;
  endDate?: string;
  currentlyHere?: boolean;
  city?: string;
  country?: string;
  summary?: string;
  description?: string;
  responsibilities?: string[];
}

export interface Education {
  // Form data format
  degreeName?: string;
  degree?: string;
  schoolName?: string;
  institution?: string;
  major?: string;
  fieldOfStudy?: string;
  startYear?: string | number;
  endYear?: string | number;
  startDate?: string;
  endDate?: string;
  currentlyEnrolled?: boolean;
  city?: string;
  country?: string;
}

export interface Skill {
  skillName?: string;
  skill?: string;
  proficiency?: string;
  level?: number;
}

export interface Language {
  language?: string;
  proficiency?: string;
  level?: number;
}

export interface Project {
  title?: string;
  description?: string;
  technologies?: string[];
  link?: string;
  url?: string;
}

export interface Certification {
  name?: string;
  issuingOrganization?: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  summary?: string;
}

export interface Reference {
  name?: string;
  position?: string;
  company?: string;
  email?: string;
  phone?: string;
}

export interface Hobby {
  name?: string;
  hobby?: string;
}

export interface Course {
  name?: string;
  institution?: string;
  completionDate?: string;
}

export interface Publication {
  title?: string;
  publisher?: string;
  publishDate?: string;
  link?: string;
}

export interface ExtraActivity {
  name?: string;
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

/**
 * Standardized CV Data Interface
 * This is the single source of truth for CV data structure
 */
export interface StandardCvData {
  personalDetails?: PersonalDetails;
  summary?: Summary;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
  languages?: Language[];
  projects?: Project[];
  certifications?: Certification[];
  references?: Reference[];
  hobbies?: Hobby[];
  courses?: Course[];
  publications?: Publication[];
  extraActivities?: ExtraActivity[];
}

