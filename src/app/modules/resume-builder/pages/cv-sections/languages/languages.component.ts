import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PrimeNgModule } from '../../../../../shared/modules/primeNg.module';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CvContentService } from '../../../../../shared/services/cv-content.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html',
    styleUrls: ['./languages.component.scss'],
    standalone: true,
    imports: [
      PrimeNgModule,
      ReactiveFormsModule,
      CommonModule
    ],
})
export class LanguagesComponent implements OnInit, OnDestroy {
  languagesForm: FormGroup;
  @Input() Languages : any;
  private formSubscription?: Subscription;
  
  constructor(
    private fb: FormBuilder,
    private cvService: CvContentService
  ) {

    this.languagesForm = this.fb.group({
      languagesRecords: this.fb.array([this.createLanguageRecord()])
    });


  }

  ngOnInit(): void {
    // Subscribe to form changes with debounce for performance
    this.formSubscription = this.languagesForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        const languagesRecords = value.languagesRecords || [];
        
        // Map to service format
        const languages = languagesRecords.map((lang: any) => ({
          language: lang.name || lang.language,
          proficiency: lang.proficiency
        }));
        
        // Update service (single source of truth)
        this.cvService.updateLanguages(languages);
      });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  // Create a new FormGroup for a language record
  createLanguageRecord(): FormGroup {
    return this.fb.group({
      name: ["", Validators.required],
      proficiency: ["", Validators.required]
    });
  }

  // Create a new FormGroup for a program
  createProgram(): FormGroup {
    return this.fb.group({
      programName: ["", Validators.required],
    });
  }

  // Get the FormArray for language records
  get languagesRecords(): FormArray {
    return this.languagesForm.get("languagesRecords") as FormArray;
  }

 
  // Add a new language record
  addLanguageRecord(): void {
    this.languagesRecords.push(this.createLanguageRecord());
  }

  // Remove a language record
  removeLanguageRecord(index: number): void {
    this.languagesRecords.removeAt(index);
  }

}
