import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { CustomEditorComponent } from '../../../../../shared/components/custom-editor/custom-editor.component';
import { NgZorroAntdModule } from '../../../../../shared/modules/ng-zero-ant.module';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgZorroAntdModule,
    CustomEditorComponent,
  ],
})
export class ExperienceComponent implements OnInit {
  experienceForm: FormGroup;
  @Input() Experience: any;

  constructor(private fb: FormBuilder) {
    this.experienceForm = this.fb.group({
      experienceRecords: this.fb.array([this.createExperienceRecord()]),
    });
  }

  ngOnInit(): void {
    this.experienceForm.valueChanges.subscribe((value: any) => {
      console.log(value, 'value');
      // this.onPersonalInfoUpdateEvt.emit(value);
    });
  }

  // Create a new FormGroup for an education record
  createExperienceRecord(): FormGroup {
    return this.fb.group({
      jobTitle: ['', Validators.required],
      employerName: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      summary: [''],
      companyWebsite: [''],
      startYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      endYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      currentlyHere: [false],
    });
  }

  // Create a new FormGroup for a program
  createProgram(): FormGroup {
    return this.fb.group({
      programName: ['', Validators.required],
    });
  }

  // Get the FormArray for education records
  get experienceRecords(): FormArray {
    return this.experienceForm.get('experienceRecords') as FormArray;
  }

  // Add a new education record
  addEducationRecord(): void {
    this.experienceRecords.push(this.createExperienceRecord());
  }

  // Remove an education record
  removeField(index: number): void {
    if (this.experienceRecords.length > 1) {
      this.experienceRecords.removeAt(index);
    }
  }

  onDateChange(date: any) {}

  // Save form data to local storage
}
