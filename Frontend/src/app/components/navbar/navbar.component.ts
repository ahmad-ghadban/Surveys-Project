import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';

import { AlertifyService } from '../../services/alertify.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  name = '';

  token = '';
  documentIcon = faFileLines;
  userIcon = faCircleUser;
  logoutIcon = faRightFromBracket;
  constructor(
    private router: Router,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user') as string);
      this.name = user.name;
      if (this.name == 'Administrator') {
        this.token = user.token;
      }
      // this.homepage();
    } else {
      localStorage.setItem('url', this.router.url);
      this.alertify.error('Login required');
      this.router.navigate(['/']); // doesnt allow to enter home without a login but an error still comes up on the console
    }
  }

  homepage() {
    const user = JSON.parse(localStorage.getItem('user') as string);
    if (user.token == this.token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
  homeCheck() {
    if (this.router.url == '/home') {
      return true;
    }
    return false;
  }
}
