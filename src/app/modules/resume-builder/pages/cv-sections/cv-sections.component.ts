

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
    // TemplateSunshineComponent,
  ],
})
export class CvSectionsComponent implements OnInit {
  step = 0;
  expandIconPosition: 'start' | 'end' = 'start';
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

  constructor() { }

  panels = [
    {
      active: true,
      disabled: false,
      icon: 'pi pi-user',
      name: 'Personal Details',
      component: CvHeaderComponent,
      visible: true,
      customStyle: {
        background: '#',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px',
      },
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-file-edit',
      name: 'Professional Summary',
      component: SummaryComponent,
      visible: true,
      customStyle: {
        background: '#',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '1px solid #',
      },
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-briefcase',
      name: 'Experience',
      component: ExperienceComponent,
      visible: true,
      customStyle: {
        background: '#',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px',
      },
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-graduation-cap',
      name: 'Education',
      component: EducationComponent,
      visible: true,
      customStyle: {
        background: '#',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px',
      },
    },

    {
      active: true,
      disabled: false,
      icon: 'pi pi-th-large',
      name: 'Skills',
      component: SkillsComponent,
      visible: true,
      customStyle: {
        background: '#',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px',
      },
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-heart',
      name: 'Hobbies',
      component: HobbiesComponent,
      visible: true,
      customStyle: {
        background: '#',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px',
      },
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-users',
      name: 'References',
      component: ReferencesComponent,
      visible: true,
      customStyle: {
        background: '#',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px',
      },
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-globe',
      name: 'Languages',
      component: LanguagesComponent,
      visible: true,
      customStyle: {
        background: '#',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px',
      },
    },
    {
      active: true,
      disabled: false,
      icon: 'pi pi-book',
      name: 'Courses',
      component: CoursesComponent,
      visible: true,
      customStyle: {
        background: '#',
        'border-radius': '1px',
        'margin-bottom': '24px',
        border: '1px solid dogerblue',
      },
    },

    {
      active: true,
      disabled: false,
      icon: 'pi pi-file-pdf',
      name: 'Publications',
      component: PublicationsComponent,
      visible: true,
      customStyle: {
        background: '#',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px',
      },
    },

    {
      active: true,
      disabled: false,
      icon: 'pi pi-calendar',
      name: 'Extra Curricular Activities',
      component: ExtraActivitiesComponent,
      visible: true,
      customStyle: {
        background: '#',
        'border-radius': '1px',
        'margin-bottom': '24px',
        border: '0px',
      },
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

  onPersonalInfoUpdateEvt(data: any) {
    console.log('PERSONAL INFO UPDATED', data);
    this.PersonalDetails = data;
  }

  onEducationFormUpdate(data: any) {
    console.log('DATA PASSED', data);
    this.Education = data.educationRecords;
  }
}
