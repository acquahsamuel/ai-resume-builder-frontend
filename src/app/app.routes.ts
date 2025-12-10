import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomepageComponent } from './modules/homepage/homepage.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((m) => m.AuthRoutes), 
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/resume-builder/resume-builder.routes').then(
        (m) => m.ResumeBuilderRoutes
      ),
  },
  {
    path: '**',
    redirectTo: '',
  }
];



