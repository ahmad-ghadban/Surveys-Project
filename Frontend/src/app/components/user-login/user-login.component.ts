import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/backend.service';
import { AlertifyService } from '../../services/alertify.service';
import { Router } from '@angular/router';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
  state = 'password';
  documentIcon = faFileLines;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.name === 'Administrator') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  onLogin(loginForm: NgForm) {
    console.log(loginForm.value); // need to remove
    this.authService.authUser(loginForm.value).subscribe(
      (response: any) => {
        console.log(response); // need to remove
        const user = response;
        localStorage.setItem(
          'user',
          JSON.stringify({ name: user.name, token: user.token })
        );
        this.alertify.success('Logged In');
        if (user.name == 'Administrator') {
          this.router.navigate(['/dashboard']);
        } else {
          if (localStorage.getItem('url')) {
            const urlId = localStorage.getItem('url') as string;
            let surveyid = parseInt(urlId.slice(8));
            this.authService.getSurvey(surveyid).subscribe((data) => {
              if (data.isPublic) {
                this.router.navigate([urlId]);
              } else {
                this.authService
                  .getUserAccess(user.name)
                  .subscribe((access) => {
                    let oldAccess = JSON.stringify(access);
                    let newAccess = JSON.parse(oldAccess);
                    let notallowed = true;
                    for (let i = 0; i < newAccess.length; i++) {
                      if (newAccess[i] == surveyid) {
                        notallowed = false;
                        this.router.navigate([urlId]);
                      }
                    }
                    if (notallowed) {
                      this.router.navigate(['/home']);
                    }
                  });
              }
            });
            // this.router.navigate([urlId]);
            localStorage.removeItem('url');
          } else {
            this.router.navigate(['/home']);
          }
        }
      },
      (error) => {
        console.log(error);
        this.alertify.error(error.error);
      }
    );
  }
  changeState() {
    if (this.state === 'password') {
      this.state = 'text';
    } else {
      this.state = 'password';
    }
  }
}
