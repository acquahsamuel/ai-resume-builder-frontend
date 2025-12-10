import { Component, OnInit, OnDestroy } from '@angular/core';
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
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PrimeNgModule,
    CustomEditorComponent,
  ],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projectsForm: FormGroup;
  private formSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private cvService: CvContentService
  ) {
    this.projectsForm = this.fb.group({
      projectRecords: this.fb.array([this.createProjectRecord()]),
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes with debounce for performance
    this.formSubscription = this.projectsForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        const projectRecords = value.projectRecords || [];

        // Map to service format
        const projects = projectRecords.map((project: any) => ({
          name: project.projectName || project.name,
          description: project.description || '',
          technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || '',
          link: project.projectLink || project.link || '',
          repositoryUrl: project.repositoryUrl || '',
          startDate: project.startYear || '',
          endDate: project.endYear || '',
          summary: project.summary || '',
        }));

        // Update service (single source of truth)
        // Note: updateProjects method can be added to CvContentService if needed
        if ((this.cvService as any).updateProjects) {
          (this.cvService as any).updateProjects(projects);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  // Create a new FormGroup for a project record
  createProjectRecord(): FormGroup {
    return this.fb.group({
      projectName: ['', Validators.required],
      description: ['', Validators.required],
      technologies: [''],
      projectLink: [''],
      repositoryUrl: [''],
      startYear: ['', [Validators.pattern('^[0-9]{4}$|^$')]],
      endYear: ['', [Validators.pattern('^[0-9]{4}$|^$')]],
      summary: [''],
    });
  }

  // Get the FormArray for project records
  get projectRecords(): FormArray {
    return this.projectsForm.get('projectRecords') as FormArray;
  }

  // Add a new project record
  addProjectRecord(): void {
    this.projectRecords.push(this.createProjectRecord());
  }

  // Remove a project record
  removeProjectRecord(index: number): void {
    if (this.projectRecords.length > 1) {
      this.projectRecords.removeAt(index);
    }
  }

  onDateChange(date: any) {
    // Handle date change if needed
  }
}
