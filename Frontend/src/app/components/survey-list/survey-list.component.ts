import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/backend.service';
import { ISurvey } from '../../model/ISurvey.interface';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css'],
})
export class SurveyListComponent implements OnInit {
  name: string;
  columns: number;

  privateSurveys: Array<ISurvey>;
  savedSurveys: Array<ISurvey>;
  @Input() surveys: Array<ISurvey>;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.columns =
      window.innerWidth <= 740
        ? 2
        : window.innerWidth <= 1080
        ? 3
        : window.innerWidth <= 1800
        ? 4
        : 5;
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user') as string);
      this.name = user.name;
      if (this.name == 'Administrator') {
        this.authService.getAllSurveys().subscribe((data) => {
          for (let i = 0; i < data.length; i++) {
            if (!data[i].published) {
              if (this.savedSurveys) {
                this.savedSurveys.push(data[i]);
              } else {
                this.savedSurveys = [data[i]];
              }
            } else {
              if (this.surveys) {
                this.surveys.push(data[i]);
              } else {
                this.surveys = [data[i]];
              }
            }
          }
        });
      } else {
        this.authService.getAllSurveys().subscribe((data) => {
          for (let i = 0; i < data.length; i++) {
            if (data[i].published) {
              if (data[i].isPublic) {
                this.authService
                  .getUserCompleted(this.name)
                  .subscribe((completeList) => {
                    let newAccess = JSON.stringify(completeList);
                    let completes = JSON.parse(newAccess);
                    let notCompleted = true;
                    for (let y = 0; y < completes.length; y++) {
                      if (data[i].id === completes[y]) {
                        notCompleted = false;
                      }
                    }
                    if (notCompleted) {
                      const currentTime = Date.now();
                      const timeRemaining = data[i].deadline - currentTime;
                      if (timeRemaining >= 0) {
                        if (this.surveys) {
                          this.surveys.push(data[i]);
                        } else {
                          this.surveys = [data[i]];
                        }
                      }
                    }
                  });
              } else {
                this.authService
                  .getSurveyParticipants(data[i].id)
                  .subscribe((oldRes) => {
                    if (oldRes === '') {
                      console.log('no one will access this');
                    } else {
                      let newAccess = JSON.stringify(oldRes);
                      let parts = JSON.parse(newAccess);

                      for (let x = 0; x < parts.length; x++) {
                        if (this.name === parts[x]) {
                          this.authService
                            .getUserCompleted(this.name)
                            .subscribe((completeList) => {
                              let newlist = JSON.stringify(completeList);
                              let completes = JSON.parse(newlist);
                              let notCompleted = true;
                              for (let y = 0; y < completes.length; y++) {
                                if (data[i].id === completes[y]) {
                                  notCompleted = false;
                                }
                              }

                              if (notCompleted) {
                                const currentTime = Date.now();
                                let timeRemaining =
                                  data[i].deadline - currentTime;
                                if (timeRemaining >= 0) {
                                  if (this.privateSurveys) {
                                    this.privateSurveys.push(data[i]);
                                  } else {
                                    this.privateSurveys = [data[i]];
                                  }
                                }
                              }
                            });
                        }
                      }
                      console.log(this.privateSurveys);
                    }
                  });
              }
            }
          }
        });
      }
    }
  }

  relativeTime(timestamp: number) {
    if (timestamp == 4832283600000) return 'None';
    else {
      const currentTime = Date.now();
      const timeRemaining = timestamp - currentTime;

      if (timeRemaining >= 172800000)
        return `${Math.floor(timeRemaining / 86400000)} days`;
      else if (timeRemaining >= 86400000) return '1 day';
      else if (timeRemaining >= 7200000)
        return `${Math.floor(timeRemaining / 3600000)} hours`;
      else if (timeRemaining >= 3600000) return '1 hour';
      else if (timeRemaining > 120000)
        return `${Math.floor(timeRemaining / 60000)} minutes`;
      else return 'Closed';
    }
  }

  redirect(surveyID: number) {
    if (this.name == 'Administrator') {
      this.router.navigate(['/survey-detail/' + surveyID]); // add id
    } else {
      this.router.navigate(['/survey/' + surveyID]);
    }
  }

  numberOfQuestions(questions) {
    const obj = JSON.parse(questions);
    return Object.keys(obj).length;
  }

  ngOnChanges() {
    this.ngOnInit();
  }
}
