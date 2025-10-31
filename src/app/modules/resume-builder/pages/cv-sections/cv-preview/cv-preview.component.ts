import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, ViewChild, ViewContainerRef, ComponentRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  ],
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
    // private mapper: CvDataMapperService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.cvService.cvData$.subscribe((data: StandardCvData) => {
        this.cvData = data;
        
        // Update existing component instance if it exists
        if (this.currentComponentRef?.instance && 'cvData' in this.currentComponentRef.instance) {
          this.currentComponentRef.instance.cvData = data;
          this.currentComponentRef.changeDetectorRef.detectChanges();
        } else if (this.templateContainer) {
          // Load/reload template if container is ready
          this.loadTemplate();
        }
        
        console.log('Preview data updated:', data);
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

