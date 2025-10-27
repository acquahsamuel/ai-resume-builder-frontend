import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../shared/modules/primeNg.module';

@Component({
  selector: 'app-resume-builder',
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, PrimeNgModule],
})
export class ResumeBuilderComponent implements OnInit {
  isLoading = false;
  isCollapsed = true;

  constructor(private chr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {}

  getInteractionPrompt() {}

  logout() {
    this.router.navigate(['/auth/login']);
  }

  OnInit() {}

  title = 'Cleansheet';

  LINKS = [
    {
      path: '/builder/resume-builder',
      icon: 'format_shapes',
      title: 'Resumes',
    },
    {
      path: '/builder/ats-analysis',
      icon: 'attach_file',
      title: 'ATS Analyzer',
    },
    {
      path: '/builder/cv-rewrite',
      icon: 'insert_drive_file',
      title: 'CV Rewrite',
    },
  ];
}
