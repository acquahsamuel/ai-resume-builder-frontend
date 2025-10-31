import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from "@angular/forms";
import { CustomEditorComponent } from "../../../../../shared/components/custom-editor/custom-editor.component";
import { CvContentService } from "../../../../../shared/services/cv-content.service";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
    selector: "app-summary",
    templateUrl: "./summary.component.html",
    styleUrls: ["./summary.component.scss"],
    standalone: true,
    imports: [ReactiveFormsModule, CustomEditorComponent],
})
export class SummaryComponent implements OnInit, OnDestroy {

  professionalSummaryForm: FormGroup<any>;

  @Input() Summary: any;
  @Output() updateSummaryInfo = new EventEmitter<any>();
  private formSubscription?: Subscription;

  constructor(
    private _fb: FormBuilder,
    private cvService: CvContentService
  ) {
    
    this.professionalSummaryForm = this._fb.group({
      summary : ['', Validators.required]
    });
   
  }

  ngOnInit(): void {
    // Subscribe to form changes with debounce for performance
    this.formSubscription = this.professionalSummaryForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        // Update service (single source of truth)
        this.cvService.updateSummary(value);
        
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
