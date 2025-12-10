# CV Sections Backend Specification

This document provides a comprehensive specification for implementing the CV sections backend API. It includes all interfaces, entities, DTOs, and data models expected by the frontend.

## Table of Contents

1. [Personal Details](#1-personal-details)
2. [Summary](#2-summary)
3. [Experience](#3-experience)
4. [Education](#4-education)
5. [Skills](#5-skills)
6. [Languages](#6-languages)
7. [Projects](#7-projects)
8. [Certifications](#8-certifications)
9. [References](#9-references)
10. [Hobbies](#10-hobbies)
11. [Courses](#11-courses)
12. [Publications](#12-publications)
13. [Extra Activities](#13-extra-activities)
14. [Complete CV Data Structure](#14-complete-cv-data-structure)

---

## 1. Personal Details

### Interface/Model

```typescript
interface PersonalDetails {
  // Primary fields (new API format)
  firstName?: string;
  lastName?: string;
  otherName?: string;
  title?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;        // Format: YYYY-MM-DD or ISO 8601
  nationality?: string;
  zipCode?: string;
  country?: string;
  state?: string;
  city?: string;
  socialMedia?: SocialMedia[];
  
  // Legacy format support (for backward compatibility)
  firstname?: string;
  lastname?: string;
  surname?: string;
  othername?: string;
  fullname?: string;
  phoneNumber?: string;
  address?: string;
  postalCode?: string;
}

interface SocialMedia {
  platform: string;  // e.g., "LinkedIn", "GitHub", "Twitter/X", etc.
  link: string;      // URL
}
```

### Form Fields (Frontend)

| Form Field | API Field | Type | Required | Validation |
|------------|-----------|------|----------|------------|
| firstName | firstName | string | No | - |
| lastName | lastName | string | No | - |
| otherName | otherName | string | No | - |
| title | title | string | No | - |
| email | email | string | No | Email format |
| phone | phone | string | No | - |
| dateOfBirth | dateOfBirth | string | No | Date format |
| nationality | nationality | string | No | - |
| zipCode | zipCode | string | No | - |
| country | country | string | No | - |
| state | state | string | No | - |
| city | city | string | No | - |
| socialMedia[].platform | socialMedia[].platform | string | No | - |
| socialMedia[].link | socialMedia[].link | string | No | URL format |

### Entity (Database)

```sql
CREATE TABLE personal_details (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  other_name VARCHAR(255),
  title VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  date_of_birth DATE,
  nationality VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  state VARCHAR(100),
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cv_id)
);

CREATE TABLE social_media (
  id BIGSERIAL PRIMARY KEY,
  personal_details_id BIGINT NOT NULL REFERENCES personal_details(id) ON DELETE CASCADE,
  platform VARCHAR(100) NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreatePersonalDetailsDto {
  firstName?: string;
  lastName?: string;
  otherName?: string;
  title?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  zipCode?: string;
  country?: string;
  state?: string;
  city?: string;
  socialMedia?: Array<{
    platform: string;
    link: string;
  }>;
}

// Response DTO
class PersonalDetailsResponseDto {
  id: number;
  cvId: number;
  firstName?: string;
  lastName?: string;
  otherName?: string;
  title?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  zipCode?: string;
  country?: string;
  state?: string;
  city?: string;
  socialMedia?: Array<{
    id: number;
    platform: string;
    link: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

---

## 2. Summary

### Interface/Model

```typescript
interface Summary {
  summary?: string;    // Rich text/HTML content
  content?: string;    // Alternative field name
}
```

### Form Fields (Frontend)

| Form Field | API Field | Type | Required | Validation |
|------------|-----------|------|----------|------------|
| summary | summary | string | Yes | - |

### Entity (Database)

```sql
CREATE TABLE summaries (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cv_id)
);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreateSummaryDto {
  summary: string;
}

// Response DTO
class SummaryResponseDto {
  id: number;
  cvId: number;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 3. Experience

### Interface/Model

```typescript
interface Experience {
  // Primary fields
  jobTitle?: string;
  employerName?: string;
  company?: string;           // Alternative to employerName
  position?: string;          // Alternative to jobTitle
  startYear?: string | number;  // Format: YYYY
  endYear?: string | number;    // Format: YYYY
  startDate?: string;         // ISO 8601 date
  endDate?: string;          // ISO 8601 date
  currentlyHere?: boolean;
  city?: string;
  country?: string;
  summary?: string;          // Rich text/HTML content
  description?: string;      // Alternative to summary
  responsibilities?: string[]; // Array of responsibility strings
  companyWebsite?: string;    // URL
}
```

### Form Fields (Frontend)

| Form Field | API Field | Type | Required | Validation |
|------------|-----------|------|----------|------------|
| jobTitle | jobTitle | string | Yes | - |
| employerName | employerName | string | Yes | - |
| city | city | string | Yes | - |
| country | country | string | Yes | - |
| startYear | startYear | string | Yes | Pattern: ^[0-9]{4}$ |
| endYear | endYear | string | Yes | Pattern: ^[0-9]{4}$ |
| currentlyHere | currentlyHere | boolean | No | Default: false |
| companyWebsite | companyWebsite | string | No | URL format |
| summary | summary | string | No | Rich text |

### Entity (Database)

```sql
CREATE TABLE experiences (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  job_title VARCHAR(255) NOT NULL,
  employer_name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  start_year VARCHAR(4) NOT NULL,
  end_year VARCHAR(4) NOT NULL,
  currently_here BOOLEAN DEFAULT FALSE,
  company_website TEXT,
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_experiences_cv_id ON experiences(cv_id);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreateExperienceDto {
  jobTitle: string;
  employerName: string;
  city: string;
  country: string;
  startYear: string;
  endYear: string;
  currentlyHere?: boolean;
  companyWebsite?: string;
  summary?: string;
}

// Response DTO
class ExperienceResponseDto {
  id: number;
  cvId: number;
  jobTitle: string;
  employerName: string;
  city: string;
  country: string;
  startYear: string;
  endYear: string;
  currentlyHere: boolean;
  companyWebsite?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. Education

### Interface/Model

```typescript
interface Education {
  // Primary fields
  nameOfInstitution?: string;
  degree?: string;
  degreeName?: string;        // Alternative to degree
  schoolName?: string;        // Alternative to nameOfInstitution
  institution?: string;       // Alternative to nameOfInstitution
  major?: string;
  fieldOfStudy?: string;
  startYear?: string | number;  // Format: YYYY
  endYear?: string | number;     // Format: YYYY
  startDate?: string;         // ISO 8601 date
  endDate?: string;          // ISO 8601 date
  currentlyEnrolled?: boolean;
  currentlyHere?: boolean;    // Alternative to currentlyEnrolled
  city?: string;
  country?: string;
  website?: string;           // Institution website URL
  summary?: string;           // Rich text/HTML content
}
```

### Form Fields (Frontend)

| Form Field | API Field | Type | Required | Validation |
|------------|-----------|------|----------|------------|
| nameOfInstitution | nameOfInstitution | string | Yes | - |
| degree | degree | string | Yes | - |
| city | city | string | Yes | - |
| country | country | string | Yes | - |
| startYear | startYear | string | Yes | Pattern: ^[0-9]{4}$ |
| endYear | endYear | string | Yes | Pattern: ^[0-9]{4}$ |
| currentlyHere | currentlyHere | boolean | No | Default: false |
| website | website | string | No | URL format |
| summary | summary | string | No | Rich text |

### Entity (Database)

```sql
CREATE TABLE educations (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  name_of_institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  website TEXT,
  summary TEXT,
  start_year VARCHAR(4) NOT NULL,
  end_year VARCHAR(4) NOT NULL,
  currently_here BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_educations_cv_id ON educations(cv_id);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreateEducationDto {
  nameOfInstitution: string;
  degree: string;
  city: string;
  country: string;
  website?: string;
  summary?: string;
  startYear: string;
  endYear: string;
  currentlyHere?: boolean;
}

// Response DTO
class EducationResponseDto {
  id: number;
  cvId: number;
  nameOfInstitution: string;
  degree: string;
  city: string;
  country: string;
  website?: string;
  summary?: string;
  startYear: string;
  endYear: string;
  currentlyHere: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Skills

### Interface/Model

```typescript
interface Skill {
  skillName?: string;        // Primary field
  skill?: string;             // Alternative to skillName
  proficiency?: string;       // e.g., "Beginner", "Intermediate", "Advanced", "Expert", "Master"
  level?: number;             // Numeric level (0-100 or similar)
}
```

### Form Fields (Frontend)

| Form Field | API Field | Type | Required | Validation | Notes |
|------------|-----------|------|----------|------------|-------|
| name | skillName | string | Yes | - | - |
| proficiency | proficiency | string | Yes | Dropdown: Beginner, Intermediate, Advanced, Expert, Master | - |
| skillLevel | level | string | Yes | - | **NOTE**: Defined in form but p-slider in HTML has no formControlName (UI bug - slider not functional) |

### Entity (Database)

```sql
CREATE TABLE skills (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  proficiency VARCHAR(50) NOT NULL,
  level INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_cv_id ON skills(cv_id);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreateSkillDto {
  skillName: string;
  proficiency: string;
  level?: number;
}

// Response DTO
class SkillResponseDto {
  id: number;
  cvId: number;
  skillName: string;
  proficiency: string;
  level?: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## 6. Languages

### Interface/Model

```typescript
interface Language {
  language?: string;          // Language name (e.g., "English", "Spanish")
  proficiency?: string;      // e.g., "Beginner", "Intermediate", "Advanced", "Expert", "Master"
  level?: number;            // Numeric level (0-100 or similar)
}
```

### Form Fields (Frontend)

| Form Field | API Field | Type | Required | Validation |
|------------|-----------|------|----------|------------|
| name | language | string | Yes | - |
| proficiency | proficiency | string | Yes | Dropdown: Beginner, Intermediate, Advanced, Expert, Master |

### Entity (Database)

```sql
CREATE TABLE languages (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  language VARCHAR(100) NOT NULL,
  proficiency VARCHAR(50) NOT NULL,
  level INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_languages_cv_id ON languages(cv_id);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreateLanguageDto {
  language: string;
  proficiency: string;
  level?: number;
}

// Response DTO
class LanguageResponseDto {
  id: number;
  cvId: number;
  language: string;
  proficiency: string;
  level?: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## 7. Projects

### Interface/Model

```typescript
interface Project {
  title?: string;
  description?: string;      // Rich text/HTML content
  technologies?: string[];    // Array of technology names
  link?: string;             // Project URL
  url?: string;              // Alternative to link
}
```

### Form Fields (Frontend)

*Note: Projects component is currently empty/stub. Use this structure for future implementation.*

### Entity (Database)

```sql
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  link TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_technologies (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_cv_id ON projects(cv_id);
CREATE INDEX idx_project_technologies_project_id ON project_technologies(project_id);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreateProjectDto {
  title?: string;
  description?: string;
  technologies?: string[];
  link?: string;
}

// Response DTO
class ProjectResponseDto {
  id: number;
  cvId: number;
  title?: string;
  description?: string;
  technologies?: string[];
  link?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 8. Certifications

### Interface/Model

```typescript
interface Certification {
  name?: string;
  issuingOrganization?: string;
  issueDate?: string;        // ISO 8601 date
  expirationDate?: string;   // ISO 8601 date
  credentialId?: string;    // Certificate ID or credential number
  summary?: string;          // Rich text/HTML content
}
```

### Form Fields (Frontend)

*Note: Certifications component not found in current codebase. Use this structure for future implementation.*

### Entity (Database)

```sql
CREATE TABLE certifications (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  name VARCHAR(255),
  issuing_organization VARCHAR(255),
  issue_date DATE,
  expiration_date DATE,
  credential_id VARCHAR(100),
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certifications_cv_id ON certifications(cv_id);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreateCertificationDto {
  name?: string;
  issuingOrganization?: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  summary?: string;
}

// Response DTO
class CertificationResponseDto {
  id: number;
  cvId: number;
  name?: string;
  issuingOrganization?: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 9. References

### Interface/Model

```typescript
interface Reference {
  name?: string;             // Reference name or company name
  position?: string;          // Reference's position/title
  contactPerson?: string;    // Alternative to position
  company?: string;          // Company name
  email?: string;            // Email address
  emailAddress?: string;     // Alternative to email
  phone?: string;            // Phone number
  phoneNumber?: string;      // Alternative to phone
  isHidden?: boolean;        // Whether to hide reference (available on request)
}
```

### Form Fields (Frontend)

| Form Field | API Field | Type | Required | Validation |
|------------|-----------|------|----------|------------|
| referenceName | name | string | Yes | - |
| contactPerson | position | string | Yes | - |
| phoneNumber | phone | string | Yes | - |
| emailAddress | email | string | Yes | Email format |
| isHidden | isHidden | boolean | No | Default: false |

### Entity (Database)

```sql
CREATE TABLE references (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_references_cv_id ON references(cv_id);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreateReferenceDto {
  name: string;
  position: string;
  company?: string;
  email: string;
  phone: string;
  isHidden?: boolean;
}

// Response DTO
class ReferenceResponseDto {
  id: number;
  cvId: number;
  name: string;
  position: string;
  company?: string;
  email: string;
  phone: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## 10. Hobbies

### Interface/Model

```typescript
interface Hobby {
  name?: string;             // Hobby name
  hobby?: string;            // Alternative to name
}
```

### Form Fields (Frontend)

| Form Field | API Field | Type | Required | Validation | Notes |
|------------|-----------|------|----------|------------|-------|
| hobbies | name | string[] | Yes | Array of hobby names | **NOTE**: p-multiSelect in HTML missing formControlName="hobbies" (UI bug - needs fix) |

**Available Hobby Options:**
- Singing, Cooking, Reading, Traveling, Gardening, Photography, Drawing, Dancing, Writing, Hiking, Fishing, Baking, Cycling, Swimming, Playing Musical Instruments

### Entity (Database)

```sql
CREATE TABLE hobbies (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hobbies_cv_id ON hobbies(cv_id);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreateHobbyDto {
  name: string;
}

// Response DTO
class HobbyResponseDto {
  id: number;
  cvId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 11. Courses

### Interface/Model

```typescript
interface Course {
  name?: string;             // Course name
  nameofCourse?: string;     // Alternative to name (form field)
  institution?: string;       // Institution name
  completionDate?: string;    // Completion date (YYYY or ISO 8601)
  endYear?: string;          // Alternative to completionDate (form field)
  summary?: string;           // Rich text/HTML content
  startYear?: string;         // Start year (form field, YYYY format)
  roleDescription?: string;   // Form field (not mapped to API)
}
```

### Form Fields (Frontend)

| Form Field | API Field | Type | Required | Validation | Notes |
|------------|-----------|------|----------|------------|-------|
| nameofCourse | name | string | Yes | - | - |
| institution | institution | string | Yes | - | - |
| startYear | - | string | Yes | Pattern: ^[0-9]{4}$ | Not sent to API, only used in form |
| endYear | completionDate | string | Yes | Pattern: ^[0-9]{4}$ | Mapped to completionDate |
| summary | summary | string | No | Rich text | - |
| roleDescription | - | string | Yes | - | **NOTE**: Defined in form but NOT in HTML template and NOT sent to API (dead code) |

### Entity (Database)

```sql
CREATE TABLE courses (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  completion_date VARCHAR(4),  -- YYYY format
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_cv_id ON courses(cv_id);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreateCourseDto {
  name: string;
  institution: string;
  completionDate?: string;
  summary?: string;
}

// Response DTO
class CourseResponseDto {
  id: number;
  cvId: number;
  name: string;
  institution: string;
  completionDate?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 12. Publications

### Interface/Model

```typescript
interface Publication {
  title?: string;            // Publication title
  name?: string;             // Alternative to title (form field)
  publisher?: string;        // Publisher name
  proficiency?: string;       // Alternative to publisher (form field, misnamed)
  publishDate?: string;       // Publication date (ISO 8601)
  skillDescription?: string;  // Alternative to publishDate (form field, misnamed)
  link?: string;             // Publication URL
  summary?: string;           // Rich text/HTML content
  description?: string;      // Alternative to summary
}
```

### Form Fields (Frontend)

| Form Field | API Field | Type | Required | Validation |
|------------|-----------|------|----------|------------|
| name | title | string | Yes | - |
| proficiency | publisher | string | Yes | (misnamed in form) |
| skillDescription | publishDate | string | Yes | (misnamed in form) |
| summary | summary | string | No | Rich text |

### Entity (Database)

```sql
CREATE TABLE publications (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  publisher VARCHAR(255) NOT NULL,
  publish_date DATE,
  link TEXT,
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_publications_cv_id ON publications(cv_id);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreatePublicationDto {
  title: string;
  publisher: string;
  publishDate?: string;
  link?: string;
  summary?: string;
}

// Response DTO
class PublicationResponseDto {
  id: number;
  cvId: number;
  title: string;
  publisher: string;
  publishDate?: string;
  link?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 13. Extra Activities

### Interface/Model

```typescript
interface ExtraActivity {
  name?: string;             // Activity name
  organization?: string;      // Organization name
  proficiency?: string;      // Alternative to organization (form field, misnamed)
  role?: string;             // Role in the activity
  skillLevel?: string;       // Alternative to role (form field, misnamed)
  startDate?: string;        // Start date (ISO 8601)
  endDate?: string;          // End date (ISO 8601)
  description?: string;      // Activity description
}
```

### Form Fields (Frontend)

| Form Field | API Field | Type | Required | Validation |
|------------|-----------|------|----------|------------|
| name | name | string | Yes | - |
| proficiency | organization | string | Yes | (misnamed in form) |
| skillLevel | role | string | Yes | (misnamed in form) |

### Entity (Database)

```sql
CREATE TABLE extra_activities (
  id BIGSERIAL PRIMARY KEY,
  cv_id BIGINT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_extra_activities_cv_id ON extra_activities(cv_id);
```

### DTO (Request/Response)

```typescript
// Request DTO
class CreateExtraActivityDto {
  name: string;
  organization: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

// Response DTO
class ExtraActivityResponseDto {
  id: number;
  cvId: number;
  name: string;
  organization: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 14. Complete CV Data Structure

### Main CV Entity

```sql
CREATE TABLE cvs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,  -- Reference to users table
  title VARCHAR(255),
  template_id BIGINT,        -- Reference to templates table
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cvs_user_id ON cvs(user_id);
```

### Complete CV Data Interface

```typescript
interface StandardCvData {
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
```

### Complete CV Response DTO

```typescript
class CvResponseDto {
  id: number;
  userId: number;
  title?: string;
  templateId?: number;
  personalDetails?: PersonalDetailsResponseDto;
  summary?: SummaryResponseDto;
  experience?: ExperienceResponseDto[];
  education?: EducationResponseDto[];
  skills?: SkillResponseDto[];
  languages?: LanguageResponseDto[];
  projects?: ProjectResponseDto[];
  certifications?: CertificationResponseDto[];
  references?: ReferenceResponseDto[];
  hobbies?: HobbyResponseDto[];
  courses?: CourseResponseDto[];
  publications?: PublicationResponseDto[];
  extraActivities?: ExtraActivityResponseDto[];
  createdAt: string;
  updatedAt: string;
}
```

---

## API Endpoints Structure

### Recommended REST Endpoints

```
GET    /api/cvs                    - Get all CVs for user
GET    /api/cvs/:id                - Get single CV with all sections
POST   /api/cvs                    - Create new CV
PUT    /api/cvs/:id                - Update entire CV
PATCH  /api/cvs/:id                - Partial update CV
DELETE /api/cvs/:id                - Delete CV

# Section-specific endpoints (optional, for granular updates)
PATCH  /api/cvs/:id/personal-details
PATCH  /api/cvs/:id/summary
PATCH  /api/cvs/:id/experience
PATCH  /api/cvs/:id/education
PATCH  /api/cvs/:id/skills
PATCH  /api/cvs/:id/languages
PATCH  /api/cvs/:id/projects
PATCH  /api/cvs/:id/certifications
PATCH  /api/cvs/:id/references
PATCH  /api/cvs/:id/hobbies
PATCH  /api/cvs/:id/courses
PATCH  /api/cvs/:id/publications
PATCH  /api/cvs/:id/extra-activities
```

---

## Validation Rules Summary

### Common Validations

1. **Email**: Must be valid email format
2. **URL**: Must be valid URL format (for links, websites)
3. **Year**: Must match pattern `^[0-9]{4}$` (4 digits)
4. **Date**: ISO 8601 format (YYYY-MM-DD)
5. **Required Fields**: As specified in each section's Form Fields table

### Proficiency Levels (for Skills and Languages)

Valid values:
- `Beginner`
- `Intermediate`
- `Advanced`
- `Expert`
- `Master`

---

## Notes for Backend Implementation

1. **Field Name Mapping**: Some form fields have different names than the API fields. Always use the API field names in the backend.

2. **Rich Text Fields**: Fields marked as "Rich text" (summary, description) may contain HTML content. Store as TEXT in database and sanitize on input.

3. **Date Handling**: 
   - Years are stored as VARCHAR(4) in format YYYY
   - Full dates should use DATE type or ISO 8601 strings

4. **Array Fields**: Some fields are arrays (technologies, responsibilities, hobbies). Use junction tables or JSON columns based on your database preference.

5. **Cascade Deletes**: All section tables should cascade delete when CV is deleted.

6. **Timestamps**: All tables should have `created_at` and `updated_at` timestamps.

7. **Indexes**: Create indexes on `cv_id` foreign keys for better query performance.

8. **Soft Deletes**: Consider implementing soft deletes if needed for audit trails.

## Frontend Issues Found (For Reference)

The following issues were identified in the frontend code that should be fixed:

1. **Courses Component**: 
   - `roleDescription` field is defined in the form but not present in the HTML template and not sent to API. This appears to be dead code.

2. **Skills Component**: 
   - `skillLevel` field is defined in the form, but the `p-slider` in the HTML template is missing `formControlName="skillLevel"`. The slider is not functional.

3. **Hobbies Component**: 
   - The `p-multiSelect` component is missing `formControlName="hobbies"`. The form field exists in TypeScript but is not bound in the template.

**Note**: These are frontend bugs that don't affect the backend specification, but should be fixed for proper functionality.

---

## Example API Request/Response

### Create CV Request

```json
{
  "title": "My Professional CV",
  "personalDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "city": "New York",
    "country": "USA",
    "socialMedia": [
      {
        "platform": "LinkedIn",
        "link": "https://linkedin.com/in/johndoe"
      }
    ]
  },
  "summary": {
    "summary": "Experienced software developer..."
  },
  "experience": [
    {
      "jobTitle": "Senior Developer",
      "employerName": "Tech Corp",
      "city": "New York",
      "country": "USA",
      "startYear": "2020",
      "endYear": "2023",
      "currentlyHere": false,
      "summary": "Led development team..."
    }
  ],
  "skills": [
    {
      "skillName": "JavaScript",
      "proficiency": "Expert",
      "level": 90
    }
  ]
}
```

### Get CV Response

```json
{
  "id": 1,
  "userId": 123,
  "title": "My Professional CV",
  "personalDetails": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "city": "New York",
    "country": "USA",
    "socialMedia": [
      {
        "id": 1,
        "platform": "LinkedIn",
        "link": "https://linkedin.com/in/johndoe"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "summary": {
    "id": 1,
    "summary": "Experienced software developer...",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "experience": [
    {
      "id": 1,
      "jobTitle": "Senior Developer",
      "employerName": "Tech Corp",
      "city": "New York",
      "country": "USA",
      "startYear": "2020",
      "endYear": "2023",
      "currentlyHere": false,
      "summary": "Led development team...",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "skills": [
    {
      "id": 1,
      "skillName": "JavaScript",
      "proficiency": "Expert",
      "level": 90,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

## Version History

- **v1.0** (2024-01-XX): Initial specification based on frontend implementation

---

## Support

For questions or clarifications, refer to the frontend codebase:
- Components: `src/app/modules/resume-builder/pages/cv-sections/`
- Models: `src/app/shared/models/cv-data.model.ts`
- Service: `src/app/shared/services/cv-content.service.ts`

