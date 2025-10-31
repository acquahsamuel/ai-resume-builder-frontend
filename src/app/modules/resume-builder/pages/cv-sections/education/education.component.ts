import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../../../shared/modules/primeNg.module';
import { CustomEditorComponent } from '../../../../../shared/components/custom-editor/custom-editor.component';
import { CvContentService } from '../../../../../shared/services/cv-content.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
  standalone: true,
  imports: [PrimeNgModule ,ReactiveFormsModule, CommonModule, CustomEditorComponent],
  changeDetection : ChangeDetectionStrategy.OnPush
})

export class EducationComponent implements OnInit, OnDestroy {
  educationForm: FormGroup;
  @Output() onEducationFormUpdate = new EventEmitter<any>();
  @Input() Education : any;
  private formSubscription?: Subscription;
  
  constructor(
    private fb: FormBuilder,
    private cvService: CvContentService
  ) {
    this.educationForm = this.fb.group({
      educationRecords: this.fb.array([this.createEducationRecord()]),
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes with debounce for performance
    this.formSubscription = this.educationForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        const educationRecords = value.educationRecords || [];
        
        // Update service (single source of truth)
        this.cvService.updateEducation(educationRecords);
        
        // Emit event for backward compatibility
        this.onEducationFormUpdate.emit(value);
      });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
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
