
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
      extraActivitiesRecords: this.fb.array([this.createExtraActivityRecord()])
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
        const activityRecords = value.extraActivitiesRecords || [];
        
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

  // Create a new FormGroup for an extra activity record
  createExtraActivityRecord(): FormGroup {
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

  // Get the FormArray for extra activity records
  get extraActivitiesRecords(): FormArray {
    return this.extraActivitiesForm.get("extraActivitiesRecords") as FormArray;
  }


  // Add a new extra activity record
  addExtraActivityRecord(): void {
    this.extraActivitiesRecords.push(this.createExtraActivityRecord());
  }

  // Remove an extra activity record
  removeExtraActivityRecord(index: number): void {
    this.extraActivitiesRecords.removeAt(index);
  }
}
