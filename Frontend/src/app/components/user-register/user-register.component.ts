import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from '../../model/IUser.interface';
import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/backend.service';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit {
  registerationForm!: FormGroup;
  user: any = {};
  state = 'password';
  stateC = 'password';
  userIcon = faUserPlus;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.name !== 'Administrator') {
        this.router.navigate(['/home']);
      }
    }
    this.createRegisterationForm();
  }

  createRegisterationForm() {
    this.registerationForm = this.fb.group(
      {
        name: [null, Validators.required],
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

  get name() {
    return this.registerationForm.get('name') as FormControl;
  }
  get password() {
    return this.registerationForm.get('password') as FormControl;
  }
  get confirmPassword() {
    return this.registerationForm.get('confirmPassword') as FormControl;
  }

  onSubmit() {
    console.log(this.registerationForm); // need to remove

    this.authService.addUser(this.userData()).subscribe(
      () => {
        this.alertify.success('User Added!');
        this.router.navigate(['/manage-users']);
      },
      (error) => {
        this.alertify.error(error.error);
      }
    );
  }

  onCancel() {
    this.router.navigate(['/manage-users']);
  }

  userData(): IUser {
    return (this.user = {
      name: this.name.value,
      password: this.password.value,
    });
  }

  changeState() {
    if (this.state === 'password') {
      this.state = 'text';
    } else {
      this.state = 'password';
    }
  }

  changeStateC() {
    if (this.stateC === 'password') {
      this.stateC = 'text';
    } else {
      this.stateC = 'password';
    }
  }
}
