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
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [PrimeNgModule, CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }>;

  showPassword = false;
  isLoading = false;

  constructor(
    public _fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this._fb.group({
      email: this._fb.control('iamsamuelacquah@gmail.com', [
        Validators.required,
        Validators.email,
      ]) as FormControl<string>,
      password: this._fb.control('Test@123456', [
        Validators.required,
        Validators.minLength(6),
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
  submitForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login({ email: email!, password: password! }).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.token) {
            // Save token to localStorage
            this.authService.saveToken(response.token);
            
            // Show success message
            this.notificationService.notify(
              response.message || 'Login successful',
              'success-toast'
            );

            // Navigate to dashboard
            this.router.navigateByUrl('/dashboard');
          }
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error?.error?.message || error?.message || 'Login failed. Please try again.';
          this.notificationService.notify(errorMessage, 'error-toast');
          console.error('Login error:', error);
        },
      });
    } else {
      // Handle form errors
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  /**
   * Get form values from controls
   */
  get formField() {
    return this.loginForm.controls;
  }

  loginWithGoogleAuth(): void {
    // this.authService.loginWithGoogleAuth().subscribe({
    //   next: (response) => {
    //     this.isLoading = false;
    //   },
    // });
  }
}
