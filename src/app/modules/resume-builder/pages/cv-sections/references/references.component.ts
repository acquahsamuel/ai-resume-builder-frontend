
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, NgFor } from "@angular/common";
import { CustomEditorComponent } from "../../../../../shared/components/custom-editor/custom-editor.component";
import { NgZorroAntdModule } from "../../../../../shared/modules/ng-zero-ant.module";

@Component({
    selector: 'app-references',
    templateUrl: './references.component.html',
    styleUrls: ['./references.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, NgZorroAntdModule, CustomEditorComponent]
})

export class ReferencesComponent implements OnInit {
  referenceForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.referenceForm = this.fb.group({
      referenceRecords: this.fb.array([this.createReferenceRecord()])
    });
  }

  ngOnInit(): void {
  
  }

  // Create a new FormGroup for an education record
  createReferenceRecord(): FormGroup {
    return this.fb.group({
      referenceName: ["", Validators.required],
      contactPerson: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      emailAddress: ["", Validators.required],
      isHidden : [false]
    });
  }

  // Create a new FormGroup for a program
  
  // Get the FormArray for education records
  get referenceRecords(): FormArray {
    return this.referenceForm.get("referenceRecords") as FormArray;
  }

  // Get the FormArray for programs within an education record
  getPrograms(educationIndex: number): FormArray {
    return this.referenceRecords.at(educationIndex).get("programs") as FormArray;
  }

  // Add a new education record
  addRecord(): void {
    this.referenceRecords.push(this.createReferenceRecord());
  }

  // Remove an education record
  removeRecord(index: number): void {
    this.referenceRecords.removeAt(index);
  }

 
  // Remove a program from a specific education record
  removeProgram(educationIndex: number, programIndex: number): void {
    this.getPrograms(educationIndex).removeAt(programIndex);
  }

  onDateChange(date: any) {}
}
