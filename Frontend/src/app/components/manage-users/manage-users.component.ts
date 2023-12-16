import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/backend.service';
import { Router } from '@angular/router';

import { AlertifyService } from '../../services/alertify.service';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditNameComponent } from '../edit-name/edit-name.component';
import { EditPasswordComponent } from '../edit-password/edit-password.component';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  userList: any[] = [];
  newName: string = '';
  newPassword: string = '';
  manageIcon = faUsers;
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.name !== 'Administrator') {
        this.router.navigate(['/home']);
      }
    }
    this.authService.getAllUsers().subscribe((data) => {
      this.userList = data;
      this.userList.shift();
      console.log(this.userList);
    });
  }

  openRegister() {
    this.router.navigate(['/registration']);
  }

  onDelete(name: string) {
    this.authService.deactivateUser(name).subscribe(
      () => {
        this.alertify.success('User Deactivated!');
        this.authService.getAllUsers().subscribe((data) => {
          this.userList = data;
          this.userList.shift();
        });
      },
      (error) => {
        this.alertify.error(error.error);
      }
    );
  }

  onActivate(name: string) {
    this.authService.activateUser(name).subscribe(
      () => {
        this.alertify.success('User Activated!');
        this.authService.getAllUsers().subscribe((data) => {
          this.userList = data;
          this.userList.shift();
        });
      },
      (error) => {
        this.alertify.error(error.error);
      }
    );
  }

  onEditName(id: number, username: string) {
    this.authService.editUserName(id, username).subscribe(
      () => {
        this.alertify.success('User Edited!');
        this.authService.getAllUsers().subscribe((data) => {
          this.userList = data;
          this.userList.shift();
        });
      },
      (error) => {
        if (error.error == 'User already exists!') {
          this.alertify.error(error.error);
        }
      }
    );
    this.newName = '';
  }

  onEditPassword(id: number, password: string) {
    this.authService.editPassword(id, password).subscribe(
      () => {
        this.alertify.success('User Edited!');
        this.authService.getAllUsers().subscribe((data) => {
          this.userList = data;
          this.userList.shift();
        });
      },
      (error) => {
        this.alertify.error(error.error);
      }
    );
    this.newPassword = '';
  }

  onSubmit(loginForm: NgForm) {
    console.log(loginForm.value); // need to remove
  }

  nameDialog(id: number) {
    let dialogRef = this.dialog.open(EditNameComponent, {
      data: { newName: this.newName },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newName = result;
        this.onEditName(id, this.newName);
      }
    });
  }

  passwordDialog(id: number) {
    let dialogRef = this.dialog.open(EditPasswordComponent, {
      data: { newPassword: this.newPassword },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newPassword = result;
        this.onEditPassword(id, this.newPassword);
      }
    });
  }
}
