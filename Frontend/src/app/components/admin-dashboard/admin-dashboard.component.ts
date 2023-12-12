import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.name !== 'Administrator') {
        this.router.navigate(['/home']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  openUsers() {
    this.router.navigate(['/manage-users']);
  }

  openSurveys() {
    this.router.navigate(['/create-survey']); // doesnt work right now
  }
}
