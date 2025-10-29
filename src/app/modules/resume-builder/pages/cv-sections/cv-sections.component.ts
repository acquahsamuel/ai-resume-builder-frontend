

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
import { CvHeaderComponent } from '../../pages/cv-sections/cv-header/cv-header.component';
import { ExperienceComponent } from '../../pages/cv-sections/experience/experience.component';
import { PrimeNgModule } from '../../../../shared/modules/primeNg.module';
import { CvContentService } from '../../../../shared/services/cv-content.service';
import { CvPreviewComponent } from './cv-preview/cv-preview.component';
import { TemplateSettingsComponent, TemplateSettings } from './template-settings/template-settings.component';
// import { TemplateSunshineComponent } from '../../../templates/template-sunshine/template-sunshine.component';

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
    // TemplateSunshineComponent,
  ],
})
export class CvSectionsComponent implements OnInit {
  step = 0;
  expandIconPosition: 'start' | 'end' = 'start';
  showTemplates = false;
  showTemplateSettings = false;
  mobileView: 'sections' | 'preview' | 'templates' = 'sections';
  selectedTemplate: string = 'sunshine';
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

  panels = [
    {
      active: true,
      disabled: false,
      icon: 'pi pi-user',
      name: 'Personal Details',
      component: CvHeaderComponent,
      visible: true,
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-file-edit',
      name: 'Professional Summary',
      component: SummaryComponent,
      visible: true,
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-briefcase',
      name: 'Experience',
      component: ExperienceComponent,
      visible: true,
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-graduation-cap',
      name: 'Education',
      component: EducationComponent,
      visible: true,
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-th-large',
      name: 'Skills',
      component: SkillsComponent,
      visible: true,
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-heart',
      name: 'Hobbies',
      component: HobbiesComponent,
      visible: true,
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-users',
      name: 'References',
      component: ReferencesComponent,
      visible: true,
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-globe',
      name: 'Languages',
      component: LanguagesComponent,
      visible: true,
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-book',
      name: 'Courses',
      component: CoursesComponent,
      visible: true,
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-file-pdf',
      name: 'Publications',
      component: PublicationsComponent,
      visible: true,
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-calendar',
      name: 'Extra Curricular Activities',
      component: ExtraActivitiesComponent,
      visible: true,
    },
  ];

  createInjector(inputs: any): Injector {
    const providers: StaticProvider[] = [
      { provide: 'inputs', useValue: inputs },
    ];
    return Injector.create({ providers, parent: this.injector });
  }

  saveToLocalStorage() { }

  ngOnInit(): void { }

  updateCv() { }

  toggleTemplates() {
    this.showTemplates = !this.showTemplates;
  }

  selectTemplate(templateName: string) {
    console.log('Selected template:', templateName);
    this.selectedTemplate = templateName;
    // Force reload of preview with new template
    this.showTemplates = false; // Optional: close template panel after selection
  }

  setMobileView(view: 'sections' | 'preview' | 'templates') {
    this.mobileView = view;
  }

  onPersonalInfoUpdateEvt(data: any) {
    console.log('PERSONAL INFO UPDATED', data);
    this.PersonalDetails = data;
    this.cvService.updatePersonalDetails(data);
  }

  onEducationFormUpdate(data: any) {
    console.log('DATA PASSED', data);
    this.Education = data.educationRecords;
    this.cvService.updateEducation(data.educationRecords);
  }

  onSummaryUpdate(data: any) {
    console.log('SUMMARY UPDATED', data);
    this.cvService.updateSummary(data);
  }

  onExperienceUpdate(data: any) {
    console.log('EXPERIENCE UPDATED', data);
    this.cvService.updateExperience(data?.experienceRecords || data);
  }

  onSkillsUpdate(data: any) {
    console.log('SKILLS UPDATED', data);
    this.cvService.updateSkills(data);
  }

  onLanguagesUpdate(data: any) {
    console.log('LANGUAGES UPDATED', data);
    this.cvService.updateLanguages(data);
  }

  toggleTemplateSettings() {
    this.showTemplateSettings = !this.showTemplateSettings;
  }

  onSettingsChange(settings: TemplateSettings) {
    console.log('Template settings updated:', settings);
    // Apply settings to preview
    // This can be passed to the preview component or used to generate CSS
  }
}
