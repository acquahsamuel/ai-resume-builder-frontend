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
      publicationsRecords: this.fb.array([this.createPublicationRecord()])
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
        const publicationRecords = value.publicationsRecords || [];
        
        // Map to service format
        const publications = publicationRecords.map((pub: any) => ({
          title: pub.name || pub.title,
          publisher: pub.proficiency || pub.publisher,
          publishDate: pub.skillDescription || pub.publishDate,
          link: pub.link || '',
          summary: pub.summary || '',
          description: pub.summary || ''
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

  // Create a new FormGroup for a publication record
  createPublicationRecord(): FormGroup {
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

  // Get the FormArray for publication records
  get publicationsRecords(): FormArray {
    return this.publicationsForm.get("publicationsRecords") as FormArray;
  }

 
  // Add a new publication record
  addPublicationRecord(): void {
    this.publicationsRecords.push(this.createPublicationRecord());
  }

  // Remove a publication record
  removePublicationRecord(index: number): void {
    this.publicationsRecords.removeAt(index);
  }

 
}
