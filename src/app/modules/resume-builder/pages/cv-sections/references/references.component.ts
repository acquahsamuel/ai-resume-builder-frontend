
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, NgFor } from "@angular/common";
import { CustomEditorComponent } from "../../../../../shared/components/custom-editor/custom-editor.component";
import { PrimeNgModule } from "../../../../../shared/modules/primeNg.module";
import { CvContentService } from "../../../../../shared/services/cv-content.service";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
    selector: 'app-references',
    templateUrl: './references.component.html',
    styleUrls: ['./references.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, PrimeNgModule, CustomEditorComponent]
})

export class ReferencesComponent implements OnInit, OnDestroy {
  referenceForm: FormGroup;
  private formSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private cvService: CvContentService
  ) {

    this.referenceForm = this.fb.group({
      referenceRecords: this.fb.array([this.createReferenceRecord()])
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes with debounce for performance
    this.formSubscription = this.referenceForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        const referenceRecords = value.referenceRecords || [];
        
        // Map to service format
        const references = referenceRecords.map((ref: any) => ({
          name: ref.referenceName || ref.name,
          position: ref.contactPerson || ref.position,
          company: ref.company || '',
          email: ref.emailAddress || ref.email,
          phone: ref.phoneNumber || ref.phone
        }));
        
        // Update service (single source of truth)
        this.cvService.updateReferences(references);
      });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
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
