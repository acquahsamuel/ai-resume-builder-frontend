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
    CommonModule
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
  ) { }

  ngOnInit(): void {
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

    if (this.templateContainer) {
      this.templateContainer.clear();
    }

    if (this.templateContainer) {
      const componentRef = this.templateContainer.createComponent(templateComponent);

      if (componentRef.instance) {
        const templateData = this.mapper.mapToTemplateFormat(this.cvData, this.selectedTemplate);

        componentRef.instance.cvData = this.cvData;
        componentRef.instance.PersonalDetails = this.cvData.personalDetails;
        componentRef.instance.Summary = this.cvData.summary;
        componentRef.instance.Experience = this.cvData.experience || [];
        componentRef.instance.Education = this.cvData.education || [];
        componentRef.instance.Skills = this.cvData.skills || [];
        componentRef.instance.Languages = this.cvData.languages || [];
        componentRef.instance.selectedTemplate = this.selectedTemplate;
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

