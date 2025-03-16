import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, NgFor } from "@angular/common";
import { CustomEditorComponent } from "../../../../../shared/components/custom-editor/custom-editor.component";
import { NgZorroAntdModule } from "../../../../../shared/modules/ng-zero-ant.module";

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, NgZorroAntdModule, CustomEditorComponent]
})

export class CoursesComponent implements OnInit {
  educationForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.educationForm = this.fb.group({
      educationRecords: this.fb.array([this.createEducationRecord()])
    });
  }

  ngOnInit(): void {
   
  }

  // Create a new FormGroup for an education record
  createEducationRecord(): FormGroup {
    return this.fb.group({
      nameofCourse: ["", Validators.required],
      institution: ["", Validators.required],
      roleDescription: ["", Validators.required],
      startYear: ["", [Validators.required, Validators.pattern("^[0-9]{4}$")]],
      endYear: ["", [Validators.required, Validators.pattern("^[0-9]{4}$")]],
      summary : ['']
    });
  }

  // Create a new FormGroup for a program
  createProgram(): FormGroup {
    return this.fb.group({
      programName: ["", Validators.required],
    });
  }

  // Get the FormArray for education records
  get educationRecords(): FormArray {
    return this.educationForm.get("educationRecords") as FormArray;
  }

  // Get the FormArray for programs within an education record
  getPrograms(educationIndex: number): FormArray {
    return this.educationRecords.at(educationIndex).get("programs") as FormArray;
  }

  // Add a new education record
  addEducationRecord(): void {
    this.educationRecords.push(this.createEducationRecord());
  }

  // Remove an education record
  removeEducationRecord(index: number): void {
    this.educationRecords.removeAt(index);
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
