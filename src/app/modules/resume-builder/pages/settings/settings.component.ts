 import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from "@angular/forms";
import { Subject } from "rxjs";
import { NgIf } from "@angular/common";
import { PrimeNgModule } from '../../../../shared/modules/primeNg.module';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: true,
    imports: [NgIf, ReactiveFormsModule, PrimeNgModule],
})


export class SettingsComponent implements OnInit {
  mode = 'date';

  @Input() PersonalDetails: any;
  @Output() onPersonalInfoUpdateEvt = new EventEmitter<any>();

  private updateSubject = new Subject<any>();

  headerInfoForm: FormGroup;
  selectedFileName: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;
 

  constructor(private _fb: FormBuilder) {

    this.headerInfoForm = this._fb.group({
      firstname: [""],
      surname: [""],
      city: [""],
      country: [""],
      postalCode: [""],
      phoneNumber: [""],
      dateOfBirth: [""],
      email: [""],
      fields: this._fb.array([]),
    });
  }

  ngOnInit(): void {
  

    if (this.PersonalDetails) {
      this.headerInfoForm.patchValue(this.PersonalDetails);
    }

    this.headerInfoForm.valueChanges.subscribe((value) => {
      this.onPersonalInfoUpdateEvt.emit(value);
    });

    // this.headerInfoForm.valueChanges.pipe(distinctUntilChanged(), debounceTime(1500))
    // .subscribe((v) => {

    //   // this.updatePersonalInfo.emit(this.headerInfoForm.value);

    // });
  }
 

  submitForm() {
    console.log(this.headerInfoForm.value);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
