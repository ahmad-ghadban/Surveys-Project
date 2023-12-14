import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/backend.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css'],
})
export class EditPasswordComponent implements OnInit {
  newPasswordForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertify: AlertifyService,
    public dialogRef: MatDialogRef<EditPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.createRegisterationForm();
  }

  createRegisterationForm() {
    this.newPasswordForm = this.fb.group(
      {
        password: [null, [Validators.required]],
        confirmPassword: [null, [Validators.required]],
      },
      { validators: this.passwordMatchingValidator }
    );
  }

  passwordMatchingValidator(fc: AbstractControl): ValidationErrors | null {
    return fc.get('password')?.value === fc.get('confirmPassword')?.value
      ? null
      : { notmatched: true };
  }

  get confirmPassword() {
    return this.newPasswordForm.get('confirmPassword') as FormControl;
  }
}
