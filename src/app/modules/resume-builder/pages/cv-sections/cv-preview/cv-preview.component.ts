import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, ViewChild, ViewContainerRef, ComponentRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvContentService } from '../../../../../shared/services/cv-content.service';
import { TemplateRegistryService } from '../../../../../shared/services/template-registry.service';
import { CvDataMapperService } from '../../../../../shared/services/cv-data-mapper.service';
import { StandardCvData } from '../../../../../shared/models/cv-data.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cv-preview',
  templateUrl: './cv-preview.component.html',
  styleUrl: './cv-preview.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    // Templates are loaded dynamically via ViewContainerRef.createComponent()
    // They don't need to be in imports array
  ],
})
export class CvPreviewComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() selectedTemplate: string = 'sunshine';
  @ViewChild('templateContainer', { read: ViewContainerRef }) templateContainer!: ViewContainerRef;
  
  cvData: StandardCvData = {};
  private subscription: Subscription = new Subscription();
  private currentComponentRef: ComponentRef<any> | null = null;

  constructor(
    private cvService: CvContentService,
    private templateRegistry: TemplateRegistryService,
    private mapper: CvDataMapperService
  ) {}

  ngOnInit(): void {
    // Subscribe to CV data changes
    this.subscription.add(
      this.cvService.cvData$.subscribe((data: StandardCvData) => {
        this.cvData = data;
        if (this.templateContainer) {
          this.loadTemplate();
        }
        console.log('Preview data updated:', data);
      })
    );
  }

  ngAfterViewInit(): void {
    // Load template after view is initialized
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
    
    if (!templateComponent) {
      console.error(`Template ${this.selectedTemplate} not found`);
      return;
    }

    // Clear existing template
    if (this.templateContainer) {
      this.templateContainer.clear();
    }

    // Create and load new template component
    if (this.templateContainer) {
      const componentRef = this.templateContainer.createComponent(templateComponent);
      
      // Pass CV data to the template component using standardized mapper
      if (componentRef.instance) {
        // Use mapper to convert to template format
        const templateData = this.mapper.mapToTemplateFormat(this.cvData, this.selectedTemplate);
        
        // Pass both formats for backward compatibility
        componentRef.instance.cvData = this.cvData;
        componentRef.instance.PersonalDetails = this.cvData.personalDetails;
        componentRef.instance.Summary = this.cvData.summary;
        componentRef.instance.Experience = this.cvData.experience || [];
        componentRef.instance.Education = this.cvData.education || [];
        componentRef.instance.Skills = this.cvData.skills || [];
        componentRef.instance.Languages = this.cvData.languages || [];
        componentRef.instance.selectedTemplate = this.selectedTemplate;
        
        // Also pass template-formatted data for templates that expect it
        componentRef.instance.templateData = templateData;
      }
      
      this.currentComponentRef = componentRef;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
    }
  }
}

