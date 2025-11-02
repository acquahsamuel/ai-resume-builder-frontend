import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { PrimeNgModule } from '../../../../../shared/modules/primeNg.module';
import { CvContentService } from '../../../../../shared/services/cv-content.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-hobbies',
  templateUrl: './hobbies.component.html',
  styleUrls: ['./hobbies.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimeNgModule],
})
export class HobbiesComponent implements OnInit, OnDestroy {
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];

  hobbiesForm: FormGroup<any>;

  @Input() Hobbies: any;
  @Output() updateSummaryInfo = new EventEmitter<any>();
  private formSubscription?: Subscription;

  constructor(
    private _fb: FormBuilder,
    private cvService: CvContentService
  ) {
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

    // Subscribe to form changes with debounce for performance
    this.formSubscription = this.hobbiesForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        const hobbiesList = Array.isArray(value.hobbies) ? value.hobbies : [];
        
        // Map to service format
        const hobbies = hobbiesList.map((hobby: string) => ({
          name: hobby,
          hobby: hobby
        }));
        
        // Update service (single source of truth)
        this.cvService.updateHobbies(hobbies);
        
        // Emit event for backward compatibility
        this.updateSummaryInfo.emit(value);
      });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }
}
