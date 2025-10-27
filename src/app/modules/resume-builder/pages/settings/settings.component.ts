import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { PrimeNgModule } from '../../../../shared/modules/primeNg.module';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimeNgModule],
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private _fb: FormBuilder) {
    this.settingsForm = this._fb.group({
      firstname: [''],
      surname: [''],
      email: [''],
      phone: [''],
      city: [''],
      country: [''],
      postalCode: [''],
      dateOfBirth: ['']
    });
  }

  ngOnInit(): void {
    this.settingsForm.valueChanges.subscribe((value : any) => {
      console.log('Settings updated:', value);
    });
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => this.imagePreview = e.target?.result || null;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    console.log('Form submitted:', this.settingsForm.value);
  }
}
