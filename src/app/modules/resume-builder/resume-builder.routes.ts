import { Routes } from '@angular/router';
import { ResumeBuilderComponent } from './resume-builder.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AtsAnalysisComponent } from './pages/ats-analysis/ats-analysis.component';
import { StartedComponent } from './pages/started/started.component';
import { CvSectionsComponent } from './pages/cv-sections/cv-sections.component';

export const ResumeBuiderRoutes: Routes = [
  {
    path: '',
    component: ResumeBuilderComponent,
    children: [
      {
        path: '',
        component: StartedComponent,
      },
      {
        path: 'getting-started',
        component: CvSectionsComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'ats-analysis',
        component: AtsAnalysisComponent,
      }
    ],
  },
];
