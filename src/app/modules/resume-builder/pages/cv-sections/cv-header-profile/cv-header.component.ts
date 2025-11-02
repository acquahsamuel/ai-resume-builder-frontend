import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../../../shared/modules/primeNg.module';
import { CvContentService } from '../../../../../shared/services/cv-content.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-cv-header',
  templateUrl: './cv-header.component.html',
  styleUrls: ['./cv-header.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, PrimeNgModule, CommonModule],
})
export class CvHeaderComponent implements OnInit, OnDestroy {
  @Input() PersonalDetails: any;
  @Output() onPersonalInfoUpdateEvt = new EventEmitter<any>();

  headerInfoForm: FormGroup;
  selectedFileName: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  private formSubscription?: Subscription;

  fieldTypes = [
    'Passport ID',
    'Nationality',
    'Military Service',
    'Driving License',
    'Gender or Pronoun',
    'Website',
    'LinkedIn',
    'Twitter/X',
    'Medium',
    'GitHub',
    'Skype',
    'Discord',
    'Dribbble',
    'Behance',
    'Stack Overflow',
    'GitLab',
    'Quora',
    'Facebook',
    'Instagram',
    'YouTube',
    'TikTok',
    'Signal',
    'Telegram',
    'WhatsApp',
    'PayPal',
    'Product Hunt',
  ];

  constructor(
    private _fb: FormBuilder,
    private cvService: CvContentService
  ) {
    this.headerInfoForm = this._fb.group({
      firstName: [''],
      lastName: [''],
      otherName: [''],
      title: [''],
      email: [''],
      phone: [''],
      dateOfBirth: [''],
      nationality: [''],
      zipCode: [''],
      country: [''],
      state: [''],
      city: [''],
      socialMedia: this._fb.array([
        this._fb.group({
          platform: [''],
          link: ['']
        })
      ]),
      // Legacy fields for backward compatibility
      fields: this._fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.PersonalDetails) {
      // Map legacy format to new format
      const mappedData = this.mapLegacyToNewFormat(this.PersonalDetails);
      
      // Patch basic fields
      this.headerInfoForm.patchValue({
        firstName: mappedData.firstName,
        lastName: mappedData.lastName,
        otherName: mappedData.otherName,
        title: mappedData.title,
        email: mappedData.email,
        phone: mappedData.phone,
        dateOfBirth: mappedData.dateOfBirth,
        nationality: mappedData.nationality,
        zipCode: mappedData.zipCode,
        country: mappedData.country,
        state: mappedData.state,
        city: mappedData.city
      });
      
      // Handle socialMedia array separately
      const socialMediaArray = this.headerInfoForm.get('socialMedia') as FormArray;
      socialMediaArray.clear();
      
      if (mappedData.socialMedia && mappedData.socialMedia.length > 0) {
        mappedData.socialMedia.forEach((social: any) => {
          socialMediaArray.push(this._fb.group({
            platform: [social.platform || ''],
            link: [social.link || '']
          }));
        });
      } else {
        // Add at least one empty social media entry
        socialMediaArray.push(this._fb.group({
          platform: [''],
          link: ['']
        }));
      }
    }

    // Subscribe to form changes with debounce for performance
    this.formSubscription = this.headerInfoForm.valueChanges
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged() // Only emit if value actually changed
      )
      .subscribe((value: any) => {
        // Transform to API format
        const apiFormat = this.transformToApiFormat(value);
        
        // Update service (single source of truth)
        this.cvService.updatePersonalDetails(apiFormat);
        
        // Emit event for backward compatibility
        this.onPersonalInfoUpdateEvt.emit(apiFormat);
      });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  /**
   * Map legacy format to new format for backward compatibility
   */
  private mapLegacyToNewFormat(data: any): any {
    return {
      firstName: data.firstName || data.firstname || '',
      lastName: data.lastName || data.surname || data.lastname || '',
      otherName: data.otherName || data.othername || '',
      title: data.title || '',
      email: data.email || '',
      phone: data.phone || data.phoneNumber || '',
      dateOfBirth: data.dateOfBirth || '',
      nationality: data.nationality || '',
      zipCode: data.zipCode || data.postalCode || '',
      country: data.country || '',
      state: data.state || '',
      city: data.city || '',
      socialMedia: data.socialMedia || []
    };
  }

  /**
   * Transform form value to API format
   */
  private transformToApiFormat(formValue: any): any {
    // Filter out empty social media entries
    const validSocialMedia = (formValue.socialMedia || []).filter((sm: any) => 
      sm.platform || sm.link
    );

    return {
      firstName: formValue.firstName || '',
      lastName: formValue.lastName || '',
      otherName: formValue.otherName || '',
      title: formValue.title || '',
      email: formValue.email || '',
      phone: formValue.phone || '',
      dateOfBirth: formValue.dateOfBirth || '',
      nationality: formValue.nationality || '',
      zipCode: formValue.zipCode || '',
      country: formValue.country || '',
      state: formValue.state || '',
      city: formValue.city || '',
      socialMedia: validSocialMedia.length > 0 ? validSocialMedia : [{ platform: '', link: '' }]
    };
  }

  onDateChange(date: any) { }

  onSocialChange(index: number) {
    // Trigger change detection when platform name changes to update icon
    this.headerInfoForm.markAsDirty();
  }


  get fields(): FormArray<FormGroup> {
    return this.headerInfoForm.get('fields') as FormArray<FormGroup>;
  }

  get socialMedia(): FormArray<FormGroup> {
    return this.headerInfoForm.get('socialMedia') as FormArray<FormGroup>;
  }

  addSocialMedia() {
    const control = this._fb.group({
      platform: [''],
      link: ['']
    });
    this.socialMedia.push(control);
  }

  removeSocialMedia(index: number) {
    if (this.socialMedia.length > 1) {
      this.socialMedia.removeAt(index);
    }
  }

  addField(fieldLabel: string) {
    const control = this._fb.group({
      label: [fieldLabel],
      value: [''],
    });
    this.fields.push(control);
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  submitForm() {
    console.log(this.headerInfoForm.value);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getFieldIcon(fieldName: string): string {
    const iconMap: { [key: string]: string } = {
      'LinkedIn': 'pi pi-linkedin',
      'Twitter/X': 'pi pi-twitter',
      'GitHub': 'pi pi-github',
      'GitLab': 'pi pi-gitlab',
      'Facebook': 'pi pi-facebook',
      'Instagram': 'pi pi-instagram',
      'YouTube': 'pi pi-youtube',
      'WhatsApp': 'pi pi-whatsapp',
      'Telegram': 'pi pi-telegram',
      'Skype': 'pi pi-skype',
      'Website': 'pi pi-globe',
      'Discord': 'pi pi-discord',
      'TikTok': 'pi pi-tiktok',
      'Dribbble': 'pi pi-dribbble',
      'Behance': 'pi pi-behance',
      'Stack Overflow': 'pi pi-stack-overflow',
      'Medium': 'pi pi-medium',
      'Quora': 'pi pi-quora',
      'PayPal': 'pi pi-paypal',
      'Signal': 'pi pi-signal',
      'Product Hunt': 'pi pi-product-hunt'
    };
    return iconMap[fieldName] || 'pi pi-link';
  }
}
