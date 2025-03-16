import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NgZorroAntdModule } from '../../../../../shared/modules/ng-zero-ant.module';

@Component({
  selector: 'app-hobbies',
  templateUrl: './hobbies.component.html',
  styleUrls: ['./hobbies.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgZorroAntdModule],
})
export class HobbiesComponent implements OnInit {
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];

  hobbiesForm: FormGroup<any>;

  @Input() Hobbies: any;
  @Output() updateSummaryInfo = new EventEmitter<any>();

  constructor(private _fb: FormBuilder) {
    this.hobbiesForm = this._fb.group({
      hobbies: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const children: Array<{ label: string; value: string }> = [
    { label: "Singing", value: "Singing" },
    { label: "Cooking", value: "Cooking" },
    { label: "Reading", value: "Reading" },
    { label: "Traveling", value: "Traveling" },
    { label: "Gardening", value: "Gardening" },
    { label: "Photography", value: "Photography" },
    { label: "Drawing", value: "Drawing" },
    { label: "Dancing", value: "Dancing" },
    { label: "Writing", value: "Writing" },
    { label: "Hiking", value: "Hiking" },
    { label: "Fishing", value: "Fishing" },
    { label: "Baking", value: "Baking" },
    { label: "Cycling", value: "Cycling" },
    { label: "Swimming", value: "Swimming" },
    { label: "Playing Musical Instruments", value: "Playing Musical Instruments" }]
    
    this.listOfOption = children;
  }
}
