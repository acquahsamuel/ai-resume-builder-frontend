import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  Injector,
  StaticProvider,
} from '@angular/core';
import { HobbiesComponent } from '../../pages/cv-sections/hobbies/hobbies.component';
import { ReferencesComponent } from '../../pages/cv-sections/references/references.component';
import { InternshipsComponent } from '../../pages/cv-sections/internships/internships.component';
import { CoursesComponent } from '../../pages/cv-sections/courses/courses.component';
import { PublicationsComponent } from '../../pages/cv-sections/publications/publications.component';
import { ProjectsComponent } from '../../pages/cv-sections/projects/projects.component';
import { LanguagesComponent } from '../../pages/cv-sections/languages/languages.component';
import { ExtraActivitiesComponent } from '../../pages/cv-sections/extra-activities/extra-activities.component';
import { CommonModule } from '@angular/common';
import { SkillsComponent } from '../../pages/cv-sections/skills/skills.component';
import { EducationComponent } from '../../pages/cv-sections/education/education.component';
import { SummaryComponent } from '../../pages/cv-sections/summary/summary.component';
import { CvHeaderComponent } from './personal-profile/personal-profile.component';
import { ExperienceComponent } from '../../pages/cv-sections/experience/experience.component';
import { PrimeNgModule } from '../../../../shared/modules/primeNg.module';
import { CvContentService } from '../../../../shared/services/cv-content.service';
import { CvPreviewComponent } from './cv-preview/cv-preview.component';
import { TemplateSettingsComponent, TemplateSettings } from './template-settings/template-settings.component';

interface SectionPanel {
  active: boolean;
  disabled: boolean;
  icon: string;
  name: string;
  component: any;
  visible: boolean;
}

interface Template {
  id: string;
  name: string;
  style: string;
  thumbnail: string;
}

@Component({
  selector: 'app-builder-ui',
  templateUrl: './cv-sections.component.html',
  styleUrl: './cv-sections.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule,
    HobbiesComponent,
    ReferencesComponent,
    InternshipsComponent,
    CoursesComponent,
    CvHeaderComponent,
    ExperienceComponent,
    PublicationsComponent,
    ProjectsComponent,
    LanguagesComponent,
    EducationComponent,
    SummaryComponent,
    SkillsComponent,
    ExtraActivitiesComponent,
    CvPreviewComponent,
    TemplateSettingsComponent,
  ],
})
export class CvSectionsComponent implements OnInit {
  currentStep: 'sections' | 'preview' | 'settings' = 'sections';
  showTemplateSettings = true;
  selectedTemplate: string = 'sunshine';
  showAddSectionMenu = false;
  showTemplateModal = false;
  showSettingsPanel = false;
  
  injector: Injector = Injector.create({
    providers: [
      {
        provide: 'CV_DATA',
        useValue: {
          PersonalDetails: [],
          Summary: [],
          Experience: [],
          Education: [],
          References: [],
          Skills: [],
          Hobbies: [],
          Internship: [],
          Courses: [],
          Publication: [],
          Project: [],
          Languages: [],
          ExtraCurricularActivities: [],
          ExtraFields: [],
        } as any,
      },
    ],
  });

  @Input() PersonalDetails = [];
  @Input() Summary = [];
  @Input() Experience = [];
  @Input() Education = [];
  @Input() References = [];
  @Input() Skills = [];
  @Input() Hobbies = [];
  @Input() Internship = [];
  @Input() Courses = [];
  @Input() Publication = [];
  @Input() Project = [];
  @Input() Languages = [];
  @Input() ExtraCurricularActivities = [];
  @Input() ExtraFields = [];

  constructor(private cvService: CvContentService) { }

  // Main sections (always visible, cannot be removed)
  mainSections: SectionPanel[] = [
    {
      active: false,
      disabled: false,
      icon: 'pi pi-user',
      name: 'Personal Profile',
      component: CvHeaderComponent,
      visible: true,
    },
    {
      active: false,
      disabled: false,
      icon: 'pi pi-file-edit',
      name: 'Professional Summary',
      component: SummaryComponent,
      visible: true,
    },
    {
      active: false,
      disabled: false,
      icon: 'pi pi-briefcase',
      name: 'Work Experience',
      component: ExperienceComponent,
      visible: true,
    },
    {
      active: false,
      disabled: false,
      icon: 'pi pi-graduation-cap',
      name: 'Education',
      component: EducationComponent,
      visible: true,
    },
    {
      active: false,
      disabled: false,
      icon: 'pi pi-th-large',
      name: 'Skills',
      component: SkillsComponent,
      visible: true,
    },
  ];

  // Optional sections (can be added/removed)
  availableOptionalSections: SectionPanel[] = [
    {
      active: false,
      disabled: false,
      icon: 'pi pi-globe',
      name: 'Languages',
      component: LanguagesComponent,
      visible: true,
    },
    {
      active: false,
      disabled: false,
      icon: 'pi pi-book',
      name: 'Courses',
      component: CoursesComponent,
      visible: true,
    },
    {
      active: false,
      disabled: false,
      icon: 'pi pi-file-pdf',
      name: 'Publications',
      component: PublicationsComponent,
      visible: true,
    },
    {
      active: false,
      disabled: false,
      icon: 'pi pi-calendar',
      name: 'Extracurricular Activities',
      component: ExtraActivitiesComponent,
      visible: true,
    },
    {
      active: false,
      disabled: false,
      icon: 'pi pi-heart',
      name: 'Hobbies',
      component: HobbiesComponent,
      visible: true,
    },
    {
      active: false,
      disabled: false,
      icon: 'pi pi-users',
      name: 'References',
      component: ReferencesComponent,
      visible: true,
    },
  ];

  // Currently active optional sections
  activeOptionalSections: SectionPanel[] = [];

  // Get all panels (main + active optional)
  get panels(): SectionPanel[] {
    return [...this.mainSections, ...this.activeOptionalSections];
  }

  templates: Template[] = [
    { id: 'sunshine', name: 'Sunshine', style: 'Modern & Clean', thumbnail: '/images/cvs/azurill.jpg' },
    { id: 'bright', name: 'Bright', style: 'Professional', thumbnail: '/assets/images/cvs/ditto.jpg' },
    { id: 'kingdom', name: 'Kingdom', style: 'Classic', thumbnail: '/assets/images/cvs/ditto.jpg' },
    { id: 'objection', name: 'Objection', style: 'Bold', thumbnail: '/images/sample.jpg' },
    { id: 'sk', name: 'SK', style: 'Minimal', thumbnail: '/assets/images/cvs/ditto.jpg' },
    { id: 'scaller', name: 'Scaller', style: 'Creative', thumbnail: '/images/sample.jpg' },
  ];

  createInjector(inputs: any): Injector {
    const providers: StaticProvider[] = [
      { provide: 'inputs', useValue: inputs },
    ];
    return Injector.create({ providers, parent: this.injector });
  }

  ngOnInit(): void {
    // Ensure panels array is initialized
    if (!this.panels || this.panels.length === 0) {
      // Panels should already be initialized, but this is a safety check
      console.warn('Panels array is empty or undefined');
    }
  }

  trackByPanelName(index: number, panel: SectionPanel): string {
    return panel?.name || `panel-${index}`;
  }

  toggleSection(panel: SectionPanel): void {
    if (panel) {
      panel.active = !panel.active;
    }
  }

  isSectionCompleted(sectionName: string | undefined): boolean {
    if (!sectionName) return false;
    // Check if section has data based on section name
    const sectionMap: { [key: string]: any[] } = {
      'Personal Profile': this.PersonalDetails,
      'Personal Details': this.PersonalDetails,
      'Professional Summary': this.Summary,
      'Work Experience': this.Experience,
      'Experience': this.Experience,
      'Education': this.Education,
      'Skills': this.Skills,
      'Languages': this.Languages,
      'Courses': this.Courses,
      'Publications': this.Publication,
      'Extracurricular Activities': this.ExtraCurricularActivities,
      'Hobbies': this.Hobbies,
      'References': this.References,
    };

    const data = sectionMap[sectionName];
    if (!data) return false;
    
    if (Array.isArray(data)) {
      return data.length > 0;
    }
    return !!data;
  }

  goToSections(): void {
    this.currentStep = 'sections';
  }

  goToPreview(): void {
    this.currentStep = 'preview';
  }

  goToSettings(): void {
    // Settings panel is now part of preview step
    if (this.currentStep === 'preview') {
      this.showSettingsPanel = true;
    }
  }

  selectTemplate(templateId: string): void {
    this.selectedTemplate = templateId;
  }

  getSelectedTemplate(): Template | undefined {
    return this.templates.find(t => t.id === this.selectedTemplate);
  }

  onSettingsChange(settings: TemplateSettings): void {
    console.log('Template settings updated:', settings);
  }

  // Get available optional sections that are not yet added
  getAvailableOptionalSections(): SectionPanel[] {
    const activeNames = this.activeOptionalSections.map(s => s.name);
    return this.availableOptionalSections.filter(s => !activeNames.includes(s.name));
  }

  // Add an optional section
  addOptionalSection(section: SectionPanel): void {
    if (!this.activeOptionalSections.find(s => s.name === section.name)) {
      this.activeOptionalSections.push({ ...section });
    }
  }

  // Remove an optional section
  removeOptionalSection(sectionName: string): void {
    this.activeOptionalSections = this.activeOptionalSections.filter(s => s.name !== sectionName);
  }

  // Check if section is optional
  isOptionalSection(sectionName: string): boolean {
    return this.availableOptionalSections.some(s => s.name === sectionName);
  }

  // Check if optional section is currently active
  isOptionalSectionActive(sectionName: string): boolean {
    return this.activeOptionalSections.some(s => s.name === sectionName);
  }

  // Toggle optional section on/off
  toggleOptionalSection(section: SectionPanel): void {
    const existingIndex = this.activeOptionalSections.findIndex(s => s.name === section.name);
    if (existingIndex >= 0) {
      // Remove if already active
      this.activeOptionalSections.splice(existingIndex, 1);
    } else {
      // Add if not active
      this.activeOptionalSections.push({ ...section });
    }
  }
}
