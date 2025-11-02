import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../../../../shared/modules/primeNg.module';

export enum FontFamily {
  ARIAL = 'Arial',
  HELVETICA = 'Helvetica',
  TIMES = 'Times New Roman',
  GEORGIA = 'Georgia',
  COURIER = 'Courier New',
}

export enum PageFormat {
  A4 = 'A4',
  LETTER = 'Letter',
  LEGAL = 'Legal',
}

export interface TemplateSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
  };
  typography: {
    fontFamily: FontFamily;
    headingSize: number;
    subheadingSize: number;
    bodySize: number;
    lineHeight: number;
  };
  layout: {
    orientation: 'portrait' | 'landscape';
    columns: number;
    sectionSpacing: number;
  };
}

@Component({
  selector: 'app-template-settings',
  templateUrl: './template-settings.component.html',
  styleUrl: './template-settings.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgModule],
})
export class TemplateSettingsComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() settingsChange = new EventEmitter<TemplateSettings>();

  fontFamilies = Object.values(FontFamily);
  pageFormats = Object.values(PageFormat);

  settings: TemplateSettings = {
    theme: {
      primaryColor: '#000000',
      secondaryColor: '#666666',
      accentColor: '#0066CC',
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
    },
    typography: {
      fontFamily: FontFamily.HELVETICA,
      headingSize: 18,
      subheadingSize: 14,
      bodySize: 11,
      lineHeight: 1.5,
    },
    layout: {
      orientation: 'portrait',
      columns: 1,
      sectionSpacing: 16,
    },
  };

  ngOnInit(): void {
    // Load saved settings from localStorage or service
    this.loadSettings();
  }

  loadSettings(): void {
    const saved = localStorage.getItem('templateSettings');
    if (saved) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
  }

  saveSettings(): void {
    localStorage.setItem('templateSettings', JSON.stringify(this.settings));
    this.settingsChange.emit(this.settings);
  }

  onSettingChange(): void {
    this.saveSettings();
  }

  closePanel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  resetSettings(): void {
    this.settings = {
      theme: {
        primaryColor: '#000000',
        secondaryColor: '#666666',
        accentColor: '#0066CC',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
      },
      typography: {
        fontFamily: FontFamily.HELVETICA,
        headingSize: 18,
        subheadingSize: 14,
        bodySize: 11,
        lineHeight: 1.5,
      },
      layout: {
        orientation: 'portrait',
        columns: 1,
        sectionSpacing: 16,
      },
    };
    this.saveSettings();
  }
}

