
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, NgFor } from "@angular/common";
import { PrimeNgModule } from "../../../../../shared/modules/primeNg.module";
import { CvContentService } from "../../../../../shared/services/cv-content.service";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: 'app-extra-activities',
  templateUrl: './extra-activities.component.html',
  styleUrls: ['./extra-activities.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PrimeNgModule]
})

export class ExtraActivitiesComponent implements OnInit, OnDestroy {
  extraActivitiesForm: FormGroup;
  editorContent: string = '';
  private formSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private cvService: CvContentService
  ) {
    this.extraActivitiesForm = this.fb.group({
      skillsRecords: this.fb.array([this.createSkillsRecord()])
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes with debounce for performance
    this.formSubscription = this.extraActivitiesForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        const activityRecords = value.skillsRecords || [];
        
        // Map to service format
        const extraActivities = activityRecords.map((activity: any) => ({
          name: activity.name,
          organization: activity.proficiency || activity.organization,
          role: activity.skillLevel || activity.role,
          description: activity.description || ''
        }));
        
        // Update service (single source of truth)
        this.cvService.updateExtraActivities(extraActivities);
      });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  // Create a new FormGroup for an education record
  createSkillsRecord(): FormGroup {
    return this.fb.group({
      name: ["", Validators.required],
      proficiency: ["", Validators.required],
      skillLevel: ["", Validators.required]
    });
  }

  // Create a new FormGroup for a program
  createProgram(): FormGroup {
    return this.fb.group({
      programName: ["", Validators.required],
    });
  }

  // Get the FormArray for education records
  get skillsRecord(): FormArray {
    return this.extraActivitiesForm.get("skillsRecords") as FormArray;
  }


  // Add a new education record
  addEducationRecord(): void {
    this.skillsRecord.push(this.createSkillsRecord());
  }

  // Remove an education record
  removeEducationRecord(index: number): void {
    this.skillsRecord.removeAt(index);
  }
}
