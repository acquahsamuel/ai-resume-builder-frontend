import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import {
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
  FormGroupDirective,
  UntypedFormControl,
  NgForm,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  FormBuilder,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../../shared/modules/primeNg.module';
import { NotificationService } from '../../../../shared/services/notification.service';


/** Error when invalid control is dirty, touched, or submitted. */


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNgModule,
    RouterModule
  ]
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
    remember: FormControl<boolean>;
  }>;

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    /**
     * Signup form control
     */
    this.signUpForm = this._fb.group({
      email: this._fb.control('', [
        Validators.required,
        Validators.email,
      ]) as FormControl<string>,
      password: this._fb.control('', [
        Validators.required,
        Validators.minLength(6),
      ]) as FormControl<string>,
      confirmPassword: this._fb.control('', [
        Validators.required,
        this.confirmationValidator,
      ]) as FormControl<string>,
      remember: this._fb.control(true) as FormControl<boolean>,
    });
  }

  ngOnInit(): void {}

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggle confirm password visibility
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get formField() {
    return this.signUpForm.controls;
  }


  /**
   * @description handles signup
   * @returns
   */
  register(): void {
    if (this.signUpForm.valid) {
      this.isLoading = true;
      const { email, password } = this.signUpForm.value;

      this.authService.register({ email: email!, password: password! }).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Show success message
          this.notificationService.notify(
            response.message || 'Registration successful! Please check your email for verification.',
            'success-toast'
          );

          // Navigate to login page after a short delay
          setTimeout(() => {
            this.router.navigateByUrl('/auth/login');
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error?.error?.message || error?.message || 'Registration failed. Please try again.';
          this.notificationService.notify(errorMessage, 'error-toast');
          console.error('Registration error:', error);
        },
      });
    } else {
      // Handle form errors
      Object.values(this.signUpForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.signUpForm.controls.confirmPassword.updateValueAndValidity()
    );
  }

  confirmationValidator: ValidatorFn = (
    control: AbstractControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signUpForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };



  signIn(): void {
    this.register();
  }

  loginWithGoogle(): void {
    // Google login implementation
    console.log('Google login');
  }



  onReset() {
    this.signUpForm.reset();
  }
}
