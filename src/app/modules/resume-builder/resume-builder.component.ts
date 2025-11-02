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
  isCollapsed = true;
  isMobileSidebarOpen = false;
  isMobile = false;
  currentPageTitle = 'Resumes';
  showHeaderActions = true;
  showTemplates = false;
  currentComponent: any;

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

  updatePageTitle(url: any) {
    if (url.includes('getting-started')) {
      this.currentPageTitle = 'Get Started';
      this.showHeaderActions = false;
    } else if (url.includes('settings')) {
      this.currentPageTitle = 'Settings';
      this.showHeaderActions = false;
    } else if (url.includes('ats-analysis')) {
      this.currentPageTitle = 'ATS Analysis';
      this.showHeaderActions = false;
    } else if (url.includes('cv-rewrite')) {
      this.currentPageTitle = 'CV Rewrite';
      this.showHeaderActions = false;
    } else if (url.includes('resume-builder') || url.includes('cv-sections')) {
      this.currentPageTitle = 'Resume Builder';
      this.showHeaderActions = true;
    } else {
      this.currentPageTitle = 'Resumes';
      this.showHeaderActions = false;
    }
  }

  onRouteActivate(component: any) {
    this.currentComponent = component;
    if (component.showTemplates !== undefined) {
      this.showTemplates = component.showTemplates;
    }
  }

  toggleTemplates() {
    if (this.currentComponent && this.currentComponent.toggleTemplates) {
      this.currentComponent.toggleTemplates();
      this.showTemplates = this.currentComponent.showTemplates;
    }
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
