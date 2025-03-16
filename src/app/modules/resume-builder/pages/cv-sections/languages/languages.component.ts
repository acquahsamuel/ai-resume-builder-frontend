import { Component, OnInit, Input } from '@angular/core';
import { NgZorroAntdModule } from '../../../../../shared/modules/ng-zero-ant.module';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html',
    styleUrls: ['./languages.component.scss'],
    standalone: true,
    imports: [
      NgZorroAntdModule,
      ReactiveFormsModule,
      CommonModule
    ],
})
export class LanguagesComponent implements OnInit {
  languagesForm: FormGroup;
   @Input() Languages : any;
  constructor(private fb: FormBuilder) {

    this.languagesForm = this.fb.group({
      skillsRecords: this.fb.array([this.createSkillsRecord()])
    });


  }

  ngOnInit(): void {
   
    this.languagesForm.valueChanges.subscribe((value : any) => {
      console.log(value, "SKILLS INFO");
      // this.onPersonalInfoUpdateEvt.emit(value);
    })
  }

  // Create a new FormGroup for an education record
  createSkillsRecord(): FormGroup {
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

  // Get the FormArray for education records
  get skillsRecord(): FormArray {
    return this.languagesForm.get("skillsRecords") as FormArray;
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
