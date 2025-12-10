import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { CustomEditorComponent } from '../../../../../shared/components/custom-editor/custom-editor.component';
import { PrimeNgModule } from '../../../../../shared/modules/primeNg.module';
import { CvContentService } from '../../../../../shared/services/cv-content.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PrimeNgModule,
    CustomEditorComponent,
  ],
})
export class CoursesComponent implements OnInit, OnDestroy {
  courseForm: FormGroup;
  private formSubscription?: Subscription;

  constructor(private fb: FormBuilder, private cvService: CvContentService) {
    this.courseForm = this.fb.group({
      courseRecords: this.fb.array([this.createCourseRecord()]),
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes with debounce for performance
    this.formSubscription = this.courseForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: any) => {
        const courseRecords = value.courseRecords || [];

        // Map to service format
        const courses = courseRecords.map((course: any) => ({
          name: course.courseName || '',
          institution: course.institution || '',
          description: course.description || '',
          completionDate: course.endYear || '',
          certificateLink: course.certificateLink || '',
          summary: course.summary || '',
        }));

        // Update service (single source of truth)
        this.cvService.updateCourses(courses);
      });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  // Create a new FormGroup for a course record
  createCourseRecord(): FormGroup {
    return this.fb.group({
      courseName: ['', Validators.required],
      institution: ['', Validators.required],
      description: [''],
      startYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      endYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      certificateLink: [''],
      summary: [''],
    });
  }

  // Create a new FormGroup for a program
  createProgram(): FormGroup {
    return this.fb.group({
      programName: ['', Validators.required],
    });
  }

  // Get the FormArray for course records
  get courseRecords(): FormArray {
    return this.courseForm.get('courseRecords') as FormArray;
  }

  // Get the FormArray for programs within a course record
  getPrograms(courseIndex: number): FormArray {
    return this.courseRecords.at(courseIndex).get('programs') as FormArray;
  }

  // Add a new course record
  addCourseRecord(): void {
    this.courseRecords.push(this.createCourseRecord());
  }

  // Remove a course record
  removeCourseRecord(index: number): void {
    this.courseRecords.removeAt(index);
  }

  // Add a new program to a specific course record
  addProgram(courseIndex: number): void {
    this.getPrograms(courseIndex).push(this.createProgram());
  }

  // Remove a program from a specific course record
  removeProgram(courseIndex: number, programIndex: number): void {
    this.getPrograms(courseIndex).removeAt(programIndex);
  }

  onDateChange(date: any) {}
}
