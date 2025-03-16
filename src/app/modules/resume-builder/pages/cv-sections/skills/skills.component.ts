import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { NgZorroAntdModule } from '../../../../../shared/modules/ng-zero-ant.module';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgZorroAntdModule],
})
export class SkillsComponent implements OnInit {
  skillsForm: FormGroup;
  editorContent: string = '';
  @Input() Skills : any;

  constructor(private fb: FormBuilder) {
    this.skillsForm = this.fb.group({
      skillsRecords: this.fb.array([this.createSkillsRecord()]),
    });
  }

  ngOnInit(): void {
    this.skillsForm.valueChanges.subscribe((value: any) => {
      console.log(value, 'SKILLS INFO');
      // this.onPersonalInfoUpdateEvt.emit(value);
    });
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
