 import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, NgFor } from "@angular/common";
import { CustomEditorComponent } from "../../../../../shared/components/custom-editor/custom-editor.component";
import { NgZorroAntdModule } from "../../../../../shared/modules/ng-zero-ant.module";

@Component({
    selector: 'app-publications',
    templateUrl: './publications.component.html',
    styleUrls: ['./publications.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, NgZorroAntdModule, CustomEditorComponent]
})

export class PublicationsComponent implements OnInit {
  publicationsForm: FormGroup;
  editorContent: string = '';

  constructor(private fb: FormBuilder) {
    this.publicationsForm = this.fb.group({
      educationRecords: this.fb.array([this.createEducationRecord()])
    });
  }

  ngOnInit(): void {
  
  }

  // Create a new FormGroup for an education record
  createEducationRecord(): FormGroup {
    return this.fb.group({
      name: ["", Validators.required],
      summary : [""],
      proficiency: ["", Validators.required],
      skillDescription : ["", Validators.required],
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
    return this.publicationsForm.get("educationRecords") as FormArray;
  }

 
  // Add a new education record
  addEducationRecord(): void {
    this.educationRecords.push(this.createEducationRecord());
  }

  // Remove an education record
  removeEducationRecord(index: number): void {
    this.educationRecords.removeAt(index);
  }

 
}
