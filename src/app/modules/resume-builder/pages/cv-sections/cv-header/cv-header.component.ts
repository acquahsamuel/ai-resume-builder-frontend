import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../../../shared/modules/primeNg.module';

@Component({
  selector: 'app-cv-header',
  templateUrl: './cv-header.component.html',
  styleUrls: ['./cv-header.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, PrimeNgModule, CommonModule],
})
export class CvHeaderComponent implements OnInit {
  @Input() PersonalDetails: any;
  @Output() onPersonalInfoUpdateEvt = new EventEmitter<any>();
 
  headerInfoForm: FormGroup;
  selectedFileName: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;

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

  constructor(private _fb: FormBuilder) {
    this.headerInfoForm = this._fb.group({
      firstname: [''],
      surname: [''],
      city: [''],
      country: [''],
      postalCode: [''],
      phoneNumber: [''],
      dateOfBirth: [''],
      email: [''],
      fields: this._fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.PersonalDetails) {
      this.headerInfoForm.patchValue(this.PersonalDetails);
    }

    this.headerInfoForm.valueChanges.subscribe((value: any) => {
      this.onPersonalInfoUpdateEvt.emit(value);
    });
  }

  onDateChange(date: any) {}

  // get fields(): FormArray {
  //   return this.headerInfoForm.get('fields') as FormArray;
  // }

  get fields(): FormArray<FormGroup> {
    return this.headerInfoForm.get('fields') as FormArray<FormGroup>;
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
