import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from '../../../../../shared/modules/ng-zero-ant.module';

@Component({
  selector: 'app-cv-header',
  templateUrl: './cv-header.component.html',
  styleUrls: ['./cv-header.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgZorroAntdModule, CommonModule],
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
}
