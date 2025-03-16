import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from '../../../../../shared/modules/ng-zero-ant.module';
import { CustomEditorComponent } from '../../../../../shared/components/custom-editor/custom-editor.component';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
  standalone: true,
  imports: [NgZorroAntdModule ,ReactiveFormsModule, CommonModule, CustomEditorComponent],
  changeDetection : ChangeDetectionStrategy.OnPush
})

export class EducationComponent implements OnInit {
  educationForm: FormGroup;
  @Output() onEducationFormUpdate = new EventEmitter<any>();
  @Input() Education : any
  
  constructor(private fb: FormBuilder) {
    this.educationForm = this.fb.group({
      educationRecords: this.fb.array([this.createEducationRecord()]),
    });
  }

  ngOnInit(): void {
    this.educationForm.valueChanges.subscribe((value: any) => {
      console.log(value, 'EDUCTION FORMS:::');
      this.onEducationFormUpdate.emit(value);
    });
  }

  // Create a new FormGroup for an education record
  createEducationRecord(): FormGroup {
    return this.fb.group({
      nameOfInstitution: ['', Validators.required],
      degree: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      website : [''],
      summary : [''],
      startYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      endYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      currentlyHere: [false],
      // programs: this.fb.array([this.createProgram()]),
    });
  }

  // Create a new FormGroup for a program
  createProgram(): FormGroup {
    return this.fb.group({
      programName: ['', Validators.required],
    });
  }

  // Get the FormArray for education records
  get educationRecords(): FormArray {
    return this.educationForm.get('educationRecords') as FormArray;
  }

  // Get the FormArray for programs within an education record
  getPrograms(educationIndex: number): FormArray {
    return this.educationRecords
      .at(educationIndex)
      .get('programs') as FormArray;
  }

  // Add a new education record
  addEducationRecord(): void {
    this.educationRecords.push(this.createEducationRecord());
  }

  // Remove an education record
  removeEducationRecord(index: number): void {
    // this.educationRecords.removeAt(index);
    if (this.educationRecords.length > 1) {
      this.educationRecords.removeAt(index);
    }
  }

  // Add a new program to a specific education record
  addProgram(educationIndex: number): void {
    this.getPrograms(educationIndex).push(this.createProgram());
  }

  // Remove a program from a specific education record
  removeProgram(educationIndex: number, programIndex: number): void {
    this.getPrograms(educationIndex).removeAt(programIndex);
  }

  onDateChange(date: any) {}
}
