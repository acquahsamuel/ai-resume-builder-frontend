import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, NgFor } from "@angular/common";
import { CustomEditorComponent } from "../../../../../shared/components/custom-editor/custom-editor.component";
import { PrimeNgModule } from "../../../../../shared/modules/primeNg.module";
import { CvContentService } from "../../../../../shared/services/cv-content.service";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
    selector: 'app-publications',
    templateUrl: './publications.component.html',
    styleUrls: ['./publications.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, PrimeNgModule, CustomEditorComponent]
})

export class PublicationsComponent implements OnInit, OnDestroy {
  publicationsForm: FormGroup;
  editorContent: string = '';
  private formSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private cvService: CvContentService
  ) {
    this.publicationsForm = this.fb.group({
      educationRecords: this.fb.array([this.createEducationRecord()])
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes with debounce for performance
    this.formSubscription = this.publicationsForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        const publicationRecords = value.educationRecords || [];
        
        // Map to service format
        const publications = publicationRecords.map((pub: any) => ({
          title: pub.name || pub.title,
          publisher: pub.proficiency || pub.publisher,
          publishDate: pub.skillDescription || pub.publishDate,
          link: pub.link || ''
        }));
        
        // Update service (single source of truth)
        this.cvService.updatePublications(publications);
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
