import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomEditorComponent } from '../../../../../shared/components/custom-editor/custom-editor.component';
import { PrimeNgModule } from '../../../../../shared/modules/primeNg.module';
import { CvContentService } from '../../../../../shared/services/cv-content.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PrimeNgModule,
    CustomEditorComponent,
  ],
})
export class InternshipsComponent implements OnInit, OnDestroy {
  internshipsForm: FormGroup;
  @Input() Internships: any;
  private formSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private cvService: CvContentService
  ) {
    this.internshipsForm = this.fb.group({
      internshipRecords: this.fb.array([this.createInternshipRecord()]),
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes with debounce for performance
    this.formSubscription = this.internshipsForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        const internshipRecords = value.internshipRecords || [];

        // Map to service format
        const internships = internshipRecords.map((internship: any) => ({
          jobTitle: internship.jobTitle || internship.position || '',
          company: internship.companyName || internship.company || '',
          city: internship.city || '',
          country: internship.country || '',
          companyWebsite: internship.companyWebsite || '',
          description: internship.description || '',
          startYear: internship.startYear || '',
          endYear: internship.endYear || '',
          currentlyHere: internship.currentlyHere || false,
        }));

        // Update service (single source of truth)
        // Note: updateInternships method can be added to CvContentService if needed
        // For now, internships follow the same pattern as experience
        if ((this.cvService as any).updateInternships) {
          (this.cvService as any).updateInternships(internships);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  // Create a new FormGroup for an internship record
  createInternshipRecord(): FormGroup {
    return this.fb.group({
      jobTitle: ['', Validators.required],
      companyName: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      companyWebsite: [''],
      description: [''],
      startYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      endYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      currentlyHere: [false],
    });
  }

  // Get the FormArray for internship records
  get internshipRecords(): FormArray {
    return this.internshipsForm.get('internshipRecords') as FormArray;
  }

  // Add a new internship record
  addInternshipRecord(): void {
    this.internshipRecords.push(this.createInternshipRecord());
  }

  // Remove an internship record
  removeInternshipRecord(index: number): void {
    if (this.internshipRecords.length > 1) {
      this.internshipRecords.removeAt(index);
    }
  }

  onDateChange(date: any) {
    // Handle date change if needed
  }
}
