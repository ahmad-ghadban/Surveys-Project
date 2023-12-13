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
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/backend.service';

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.css'],
})
export class EditNameComponent implements OnInit {
  newNameForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertify: AlertifyService,
    public dialogRef: MatDialogRef<EditNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.createRegisterationForm();
    this.newNameForm.value.reset();
  }

  createRegisterationForm() {
    this.newNameForm = this.fb.group({
      name: ['', Validators.required],
    });
  }
}
