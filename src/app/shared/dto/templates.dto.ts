export interface SocialMedia {
  platform: string;
  link: string;
}

 
export interface HeaderProfileInfo {
  firstname : string;
  lastname : string;
  othername : string;
  fullname: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  city : string;
  country  : string;
  postalCode : string;
  dateOfBirth? : string;
  socialMedia: SocialMedia[];
}

export interface ProfessionalSummary{
  summary : string;
}

 
export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  city : string;
  country : string;
  startDate: string;  
  endDate: string; 
}

 
export interface Experience {
  company: string;
  position: string;
  startDate: string; 
  endDate: string; 
  description?: string;
  responsibilities: string[];
}

 
export interface Skill {
  skill: string;
  proficiency: string;
  level: number; 
}

// Define the certifications interface
export interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: string; 
  summary?: string;
  expirationDate?: string; 
  credentialId?: string;  
}


// Define the project interface
export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link: string;
}

// Define the languages interface
export interface Language {
  language: string;
  proficiency: string; 
}

 
export interface AdditionalSection {
  sectionTitle: string;
  details: string;
}


export interface Hobbies{
  hobby : string[];
}  


// Define the main export type for the entire structure
export interface ITemplate {
  id?: number;
  userId?: string;
  templateId: string;
  HeaderProfileInfo: HeaderProfileInfo;
  ProfessionalSummary : ProfessionalSummary;
  Education: Education[];
  Experience: Experience[];
  Skills: Skill[];
  Hobbies: Hobbies[];
  Certifications: Certification[];
  Projects: Project[];
  Languages: Language[];
  AdditionalSections: AdditionalSection[];
  createdAt: string; 
  updatedAt: string;
}

// Template Layout Configuration
export interface TemplateLayout {
  sections?: string[];
  sectionOrder?: string[];
  orientation?: 'portrait' | 'landscape';
  columns?: number;
  sectionSpacing?: number;
}

// Template Typography Configuration
export interface TemplateTypography {
  fontFamily?: string;
  headingSize?: number;
  subheadingSize?: number;
  bodySize?: number;
  lineHeight?: number;
  fontWeight?: 'normal' | 'bold' | 'lighter' | number;
}

// Template Theme Configuration
export interface TemplateTheme {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  customCSS?: string;
}

// Template Page Settings
export interface TemplatePageSettings {
  format?: string; // e.g., "A4"
  margins?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  showLineBreaks?: boolean;
  showPageNumbers?: boolean;
  pageNumberFormat?: string;
  isPublic?: boolean;
  publicUrl?: string;
}

// Template Export Settings
export interface TemplateExportSettings {
  pdf?: {
    enabled?: boolean;
    quality?: string;
    watermark?: string;
  };
  json?: {
    enabled?: boolean;
    includeMetadata?: boolean;
  };
}

// Template Notes
export interface TemplateNotes {
  content?: string;
  lastEditedAt?: string;
}

// Template Statistics
export interface TemplateStatistics {
  views?: number;
  downloads?: number;
  lastViewedAt?: string;
  lastDownloadedAt?: string;
}

// Template Request DTO (for creating/updating templates)
export interface ITemplateRequest {
  name: string;
  description?: string;
  category?: string;
  layout?: TemplateLayout;
  typography?: TemplateTypography;
  theme?: TemplateTheme;
  pageSettings?: TemplatePageSettings;
  exportSettings?: TemplateExportSettings;
  notes?: TemplateNotes;
  isPremium?: boolean;
  isActive?: boolean;
  statistics?: TemplateStatistics;
}

// Template Response DTO (what the API returns)
export interface ITemplateResponse extends ITemplateRequest {
  _id?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}
