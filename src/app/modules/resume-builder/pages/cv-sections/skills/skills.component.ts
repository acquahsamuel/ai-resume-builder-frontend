import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { PrimeNgModule } from '../../../../../shared/modules/primeNg.module';
import { CvContentService } from '../../../../../shared/services/cv-content.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PrimeNgModule],
})
export class SkillsComponent implements OnInit, OnDestroy {
  skillsForm: FormGroup;
  editorContent: string = '';
  @Input() Skills : any;
  private formSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private cvService: CvContentService
  ) {
    this.skillsForm = this.fb.group({
      skillsRecords: this.fb.array([this.createSkillsRecord()]),
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes with debounce for performance
    this.formSubscription = this.skillsForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        const skillsRecords = value.skillsRecords || [];
        
        // Map to service format
        const skills = skillsRecords.map((skill: any) => ({
          skillName: skill.name || skill.skillName,
          skill: skill.name || skill.skillName,
          proficiency: skill.proficiency,
          level: skill.skillLevel
        }));
        
        // Update service (single source of truth)
        this.cvService.updateSkills(skills);
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
      name: ['', Validators.required],
      proficiency: ['', Validators.required],
      skillLevel: ['', Validators.required],
    });
  }

  // Create a new FormGroup for a program
  createProgram(): FormGroup {
    return this.fb.group({
      programName: ['', Validators.required],
    });
  }

  // Get the FormArray for education records
  get skillsRecord(): FormArray {
    return this.skillsForm.get('skillsRecords') as FormArray;
  }

  // Add a new education record
  addRecord(): void {
    this.skillsRecord.push(this.createSkillsRecord());
  }

  // Remove an education record
  removeRecord(index: number): void {
    this.skillsRecord.removeAt(index);
  }
}
