import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router'; 
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PrimeNgModule } from '../../shared/modules/primeNg.module';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-resume-builder',
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, PrimeNgModule],
})
export class ResumeBuilderComponent implements OnInit {
  isLoading = false;
  isCollapsed = false;
  isMobileSidebarOpen = false;
  isMobile = false;
  currentPageTitle = 'Resumes';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.setupRouteListener();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 1024;
      if (this.isMobile && this.isCollapsed) {
        this.isCollapsed = false;
      }
    }
  }

  setupRouteListener() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updatePageTitle(event.url);
      });
  }

  updatePageTitle(url: string) {
    if (url.includes('getting-started')) {
      this.currentPageTitle = 'Get Started';
    } else if (url.includes('settings')) {
      this.currentPageTitle = 'Settings';
    } else if (url.includes('ats-analysis')) {
      this.currentPageTitle = 'ATS Analysis';
    } else if (url.includes('cv-rewrite')) {
      this.currentPageTitle = 'CV Rewrite';
    } else if (url.includes('resume-builder')) {
      this.currentPageTitle = 'Resume Builder';
    } else {
      this.currentPageTitle = 'Resumes';
    }
  }

  onRouteActivate(component: any) {
    // Handle component activation
  }

  toggleSidebar() {
    if (!this.isMobile) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  getInteractionPrompt() {}

  logout() {
    this.closeMobileSidebar();
    this.router.navigate(['/auth/login']);
  }

  title = 'Cleansheet';
}
