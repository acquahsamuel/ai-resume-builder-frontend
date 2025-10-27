import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ResetPasswordComponent implements OnInit {
  // @ts-ignore
  resetPasswordForm: UntypedFormGroup;

  constructor(
    private authSerive: AuthService,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  getEmailValue() {
    return this.resetPasswordForm.controls;
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      // throw new Error('')
      return;
    }
  }
}
