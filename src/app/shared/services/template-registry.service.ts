import { Injectable, Type } from '@angular/core';

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  component?: Type<any>;
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

      },
      {
        id: 'bright',
        name: 'Bright',
        description: 'Professional',
        thumbnail: '/assets/images/cvs/ditto.jpg',

      },
      {
        id: 'kingdom',
        name: 'Kingdom',
        description: 'Classic',
        thumbnail: '/assets/images/cvs/ditto.jpg',

      },
      {
        id: 'objection',
        name: 'Objection',
        description: 'Bold',
        thumbnail: '/images/sample.jpg',

      },
      {
        id: 'sk',
        name: 'SK',
        description: 'Minimal',
        thumbnail: '/assets/images/cvs/ditto.jpg',

      },
      {
        id: 'scaller',
        name: 'Scaller',
        description: 'Creative',
        thumbnail: '/images/sample.jpg',

      },
      {
        id: 'uptown',
        name: 'Uptown',
        description: 'Elegant',
        thumbnail: '/images/sample.jpg',

      },
      {
        id: 'toastr',
        name: 'Toastr',
        description: 'Modern',
        thumbnail: '/images/sample.jpg',

      },
      {
        id: 'pincode',
        name: 'Pincode',
        description: 'Tech-focused',
        thumbnail: '/images/sample.jpg',

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

