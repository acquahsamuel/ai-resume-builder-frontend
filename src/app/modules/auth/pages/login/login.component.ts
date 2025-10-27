import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../../shared/modules/primeNg.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [PrimeNgModule, CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }>;

  constructor(
    public _fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this._fb.group({
      userName: this._fb.control('', [
        Validators.required,
      ]) as FormControl<string>,
      password: this._fb.control('', [
        Validators.required,
      ]) as FormControl<string>,
      remember: this._fb.control(true) as FormControl<boolean>,
    });
  }

  ngOnInit(): void {}

  login() {}

   

  confirmationValidator: ValidatorFn = (
    control: AbstractControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.loginForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  /**
   * @description handles login
   * @returns
   */
  submitForm() {
    this.router.navigateByUrl('/builder/resume-builder');
    if (this.loginForm.valid) {
      const { userName, password, remember } = this.loginForm.value;
    } else {
      // Handle form errors
      if (this.loginForm.valid) {
        console.log('submit', this.loginForm.value);
      } else {
        Object.values(this.loginForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
  }

  /**
   * Get form values from controls
   */
  get formField() {
    return this.loginForm.controls;
  }
}
