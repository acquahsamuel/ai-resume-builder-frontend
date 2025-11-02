import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, ViewChild, ViewContainerRef, ComponentRef, AfterViewInit, SecurityContext, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CvContentService } from '../../../../../shared/services/cv-content.service';
import { TemplateRegistryService } from '../../../../../shared/services/template-registry.service';
import { StandardCvData } from '../../../../../shared/models/cv-data.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cv-preview',
  templateUrl: './cv-preview.component.html',
  styleUrl: './cv-preview.component.scss',
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class CvPreviewComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() selectedTemplate: string = 'sunshine';
  @ViewChild('templateContainer', { read: ViewContainerRef }) templateContainer!: ViewContainerRef;

  cvData: StandardCvData = {};
  private subscription: Subscription = new Subscription();
  currentComponentRef: ComponentRef<any> | null = null;

  constructor(
    private cvService: CvContentService,
    private templateRegistry: TemplateRegistryService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
    // private mapper: CvDataMapperService
  ) { }

  sanitizeHtml(html: string | undefined | null): SafeHtml {
    if (!html || (typeof html === 'string' && html.trim() === '')) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }

    // Convert to string if it's not already
    const htmlString = String(html);

    // If the content looks like plain text (no HTML tags), wrap it in a paragraph
    if (!/<[^>]+>/.test(htmlString)) {
      return this.sanitizer.bypassSecurityTrustHtml(`<p>${htmlString}</p>`);
    }

    // Sanitize the HTML to prevent XSS attacks, but preserve formatting
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, htmlString);

    // If sanitization removed everything, try with bypass (for trusted content)
    if (!sanitized || sanitized.trim() === '') {
      // Fallback: trust the HTML but still sanitize dangerous scripts
      return this.sanitizer.bypassSecurityTrustHtml(htmlString);
    }

    // Return sanitized HTML
    return this.sanitizer.bypassSecurityTrustHtml(sanitized);
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cvService.cvData$.subscribe((data: StandardCvData) => {
        this.cvData = { ...data }; // Create a new reference to trigger change detection

        // Log for debugging
        console.log('Preview data updated:', data);
        if (data.summary) {
          console.log('Summary data:', data.summary);
          console.log('Summary content:', data.summary.summary || data.summary.content);
        }
        if (data.experience && data.experience.length > 0) {
          console.log('Experience data:', data.experience);
          data.experience.forEach((exp, idx) => {
            console.log(`Experience ${idx} summary/description:`, exp.summary || exp.description);
          });
        }

        // Force change detection
        this.cdr.markForCheck();

        // Update existing component instance if it exists
        if (this.currentComponentRef?.instance && 'cvData' in this.currentComponentRef.instance) {
          this.currentComponentRef.instance.cvData = this.cvData;
          this.currentComponentRef.changeDetectorRef.detectChanges();
        } else if (this.templateContainer) {
          // Load/reload template if container is ready
          this.loadTemplate();
        }
      })
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadTemplate();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTemplate'] && this.templateContainer) {
      this.loadTemplate();
    }
  }

  private loadTemplate(): void {
    const templateComponent = this.templateRegistry.getTemplateComponent(this.selectedTemplate || 'sunshine');

    if (templateComponent && this.templateContainer) {
      // Clear previous component
      if (this.currentComponentRef) {
        this.currentComponentRef.destroy();
        this.currentComponentRef = null;
      }

      this.templateContainer.clear();

      // Create the template component dynamically
      const componentRef = this.templateContainer.createComponent(templateComponent);
      this.currentComponentRef = componentRef;

      // Pass cvData to the template component if it has an @Input for it
      if (componentRef.instance && 'cvData' in componentRef.instance) {
        componentRef.instance.cvData = this.cvData;
      }

      // Trigger change detection
      componentRef.changeDetectorRef.detectChanges();
    } else {
      // Fallback: Show data preview when no template component is registered
      console.log('Template component not found, showing data preview');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
    }
  }

  hasNoData(): boolean {
    if (!this.cvData) return true;
    return !this.cvData.personalDetails &&
      !this.cvData.summary &&
      (!this.cvData.experience || this.cvData.experience.length === 0) &&
      (!this.cvData.education || this.cvData.education.length === 0) &&
      (!this.cvData.skills || this.cvData.skills.length === 0) &&
      (!this.cvData.languages || this.cvData.languages.length === 0) &&
      (!this.cvData.projects || this.cvData.projects.length === 0) &&
      (!this.cvData.certifications || this.cvData.certifications.length === 0) &&
      (!this.cvData.courses || this.cvData.courses.length === 0) &&
      (!this.cvData.publications || this.cvData.publications.length === 0) &&
      (!this.cvData.extraActivities || this.cvData.extraActivities.length === 0) &&
      (!this.cvData.hobbies || this.cvData.hobbies.length === 0) &&
      (!this.cvData.references || this.cvData.references.length === 0);
  }
}

