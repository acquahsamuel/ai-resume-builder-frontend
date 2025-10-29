import { Injectable, Type } from '@angular/core';
import { TemplateSunshineComponent } from '../../modules/resume-builder/templates/template-sunshine/template-sunshine.component';
import { TemplateBrightComponent } from '../../modules/resume-builder/templates/template-bright/template-bright.component';
import { TemplateKingdomComponent } from '../../modules/resume-builder/templates/template-kingdom/template-kingdom.component';
import { TemplateObjectionComponent } from '../../modules/resume-builder/templates/template-objection/template-objection.component';
import { TemplateSkComponent } from '../../modules/resume-builder/templates/template-sk/template-sk.component';
import { TemplateScallerComponent } from '../../modules/resume-builder/templates/template-scaller/template-scaller.component';
import { TemplateUptownComponent } from '../../modules/resume-builder/templates/template-uptown/template-uptown.component';
import { TemplateToastrComponent } from '../../modules/resume-builder/templates/template-toastr/template-toastr.component';
import { TemplatePincodeComponent } from '../../modules/resume-builder/templates/template-pincode/template-pincode.component';

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  component: Type<any>;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateRegistryService {
  private templates: Map<string, TemplateConfig> = new Map();

  constructor() {
    this.registerTemplates();
  }

  private registerTemplates(): void {
    const templateConfigs: TemplateConfig[] = [
      {
        id: 'sunshine',
        name: 'Sunshine',
        description: 'Modern & Clean',
        thumbnail: '/assets/images/cvs/azurill.jpg',
        component: TemplateSunshineComponent
      },
      {
        id: 'bright',
        name: 'Bright',
        description: 'Professional',
        thumbnail: '/assets/images/cvs/ditto.jpg',
        component: TemplateBrightComponent
      },
      {
        id: 'kingdom',
        name: 'Kingdom',
        description: 'Classic',
        thumbnail: '/assets/images/cvs/ditto.jpg',
        component: TemplateKingdomComponent
      },
      {
        id: 'objection',
        name: 'Objection',
        description: 'Bold',
        thumbnail: '/images/sample.jpg',
        component: TemplateObjectionComponent
      },
      {
        id: 'sk',
        name: 'SK',
        description: 'Minimal',
        thumbnail: '/assets/images/cvs/ditto.jpg',
        component: TemplateSkComponent
      },
      {
        id: 'scaller',
        name: 'Scaller',
        description: 'Creative',
        thumbnail: '/images/sample.jpg',
        component: TemplateScallerComponent
      },
      {
        id: 'uptown',
        name: 'Uptown',
        description: 'Elegant',
        thumbnail: '/images/sample.jpg',
        component: TemplateUptownComponent
      },
      {
        id: 'toastr',
        name: 'Toastr',
        description: 'Modern',
        thumbnail: '/images/sample.jpg',
        component: TemplateToastrComponent
      },
      {
        id: 'pincode',
        name: 'Pincode',
        description: 'Tech-focused',
        thumbnail: '/images/sample.jpg',
        component: TemplatePincodeComponent
      }
    ];

    templateConfigs.forEach(config => {
      this.templates.set(config.id, config);
    });
  }

  getTemplate(id: string): TemplateConfig | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): TemplateConfig[] {
    return Array.from(this.templates.values());
  }

  getTemplateComponent(id: string): Type<any> | undefined {
    const config = this.templates.get(id);
    return config?.component;
  }

  /**
   * Check if a template exists
   */
  hasTemplate(id: string): boolean {
    return this.templates.has(id);
  }

  /**
   * Get template thumbnail URL
   */
  getTemplateThumbnail(id: string): string | undefined {
    const config = this.templates.get(id);
    return config?.thumbnail;
  }
}

