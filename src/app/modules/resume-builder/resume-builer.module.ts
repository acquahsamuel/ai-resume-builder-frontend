import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ResumeBuilderComponent } from "./resume-builder.component";
// import { ResumeBuilderRoutingModule } from "./resume-routing.module";
import { CvHeaderComponent } from "./pages/cv-sections/cv-header-profile/cv-header.component";
import { ExperienceComponent } from "./pages/cv-sections/experience/experience.component";
import { EducationComponent } from "./pages/cv-sections/education/education.component";
import { SkillsComponent } from "./pages/cv-sections/skills/skills.component";
import { SummaryComponent } from "./pages/cv-sections/summary/summary.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { BuilderUiComponent } from "./components/builder-ui/builder-ui.component";
import { HobbiesComponent } from "./pages/cv-sections/hobbies/hobbies.component";
import { ReferencesComponent } from "./pages/cv-sections/references/references.component";
import { InternshipsComponent } from "./pages/cv-sections/internships/internships.component";
import { CoursesComponent } from "./pages/cv-sections/courses/courses.component";
import { PublicationsComponent } from "./pages/cv-sections/publications/publications.component";
import { ProjectsComponent } from "./pages/cv-sections/projects/projects.component";
import { LanguagesComponent } from "./pages/cv-sections/languages/languages.component";
import { ExtraActivitiesComponent } from "./pages/cv-sections/extra-activities/extra-activities.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { AtsAnalysisComponent } from "./pages/ats-analysis/ats-analysis.component";
import { StartedComponent } from './pages/started/started.component';
import { RouterModule, Routes } from '@angular/router';
import { ResumeBuiderRoutes } from "./resume-builder.routes";


@NgModule({
    imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ResumeBuilderComponent,
    CvHeaderComponent,
    ExperienceComponent,
    EducationComponent,
    SkillsComponent,
    SummaryComponent,
    HobbiesComponent,
    ReferencesComponent,
    InternshipsComponent,
    CoursesComponent,
    PublicationsComponent,
    ProjectsComponent,
    LanguagesComponent,
    ExtraActivitiesComponent,
    SettingsComponent,
    AtsAnalysisComponent,
    StartedComponent,
    RouterModule.forChild(ResumeBuiderRoutes),
],
exports: [RouterModule],
})
export class ResumeBuilerModule {}
