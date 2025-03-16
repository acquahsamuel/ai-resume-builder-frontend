import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from "@angular/forms";
import { CustomEditorComponent } from "../../../../../shared/components/custom-editor/custom-editor.component";

@Component({
    selector: "app-summary",
    templateUrl: "./summary.component.html",
    styleUrls: ["./summary.component.scss"],
    standalone: true,
    imports: [ReactiveFormsModule, CustomEditorComponent],
})
export class SummaryComponent implements OnInit {

  professionalSummaryForm: FormGroup<any>;

  @Input() Summary: any;
  @Output() updateSummaryInfo = new EventEmitter<any>();

  constructor(private _fb: FormBuilder) {
    
    this.professionalSummaryForm = this._fb.group({
      summary : ['', Validators.required]
    });
   
  }

  ngOnInit(): void {
  


    this.professionalSummaryForm.valueChanges.subscribe((value) => {
      console.log("VALUES IN SUMMARY::", value)
      this.updateSummaryInfo.emit(value);
    });

 
  }
 
}
