import { Component, OnInit } from '@angular/core';
// import { AuthService } from 'src/app/shared/services/auth.service';
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
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../../shared/modules/primeNg.module';
 

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
    userName: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
    remember: FormControl<boolean>;
  }>;

 
 

  constructor(
    private authService: AuthService,
    private router: Router,
    // private jwtService: JwtHelperService,
    private _fb: UntypedFormBuilder,
    // private snackBar: MatSnackBar
  ) {

     /**
     * Signup form control
     */
     this.signUpForm = this._fb.group({
      userName: this._fb.control('', [
        Validators.required,
      ]) as FormControl<string>,
      password: this._fb.control('', [
        Validators.required,
      ]) as FormControl<string>,
      confirmPassword: this._fb.control('', [
        Validators.required,
      ]) as FormControl<string>,
      remember: this._fb.control(true) as FormControl<boolean>,
    });
  }

  ngOnInit(): void {
   
  }

  get formField() {
    return this.signUpForm.controls;
  }


  /**
   * @description handles signup
   * @returns
   */
  register() {
 
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



  signIn( ) {
    
  }

  loginWithGoogle(){}

  

  onReset() {
    this.signUpForm.reset();
  }
}
