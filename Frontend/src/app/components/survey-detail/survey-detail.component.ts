import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timeout } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { ISurvey } from '../../model/ISurvey.interface';

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.component.html',
  styleUrls: ['./survey-detail.component.css'],
})
export class SurveyDetailComponent implements OnInit {
  surveyId: number;
  survey: ISurvey;
  bool: boolean = false;
  toggle: boolean;
  surveyUrl = environment.surveyUrl;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.surveyId = this.route.snapshot.params['id'];
    this.authService.getSurvey(this.surveyId).subscribe((data: ISurvey) => {
      this.survey = data;

      const obj = JSON.parse(this.survey.questions.toString());
      this.survey.questions = obj;

      for (let i = 0; i < this.survey.questions.length; i++) {
        this.survey.questions[i].Question = Object.keys(
          this.survey.questions[i]
        ).toString();

        this.survey.questions[i].Answers = Object.values(
          this.survey.questions[i]
        )[0];
      }
      this.toggle = this.survey.published;
      console.log(this.survey);
    });
  }

  redirectToResults() {
    this.router.navigate(['/results/' + this.surveyId]);
  }

  onDelete() {
    this.authService.deleteSurvey(this.surveyId).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  onPublish() {
    this.authService.publishSurvey(this.surveyId).subscribe(() => {
      this.alertify.success('Survey Published!');
      if (!this.survey.isPublic) {
        this.authService
          .getSurveyParticipants(this.surveyId)
          .subscribe((participants) => {
            var part = JSON.stringify(participants);
            part = part.slice(1, -1);
            var newPart = part.split(',');
            for (let i = 0; i < newPart.length; i++) {
              let str = newPart[i].replace(/^"(.*)"$/, '$1');
              console.log(str);
              this.authService.getUserAccess(str).subscribe((oldAccess) => {
                console.log(oldAccess);
                if (oldAccess === '') {
                  var newAccess = '%5B' + this.surveyId + '%5D';
                } else {
                  var newAccess = JSON.stringify(oldAccess);
                  var objString =
                    '?' + new URLSearchParams(newAccess).toString();
                  newAccess =
                    objString.slice(1, -4) + '%2C' + this.surveyId + '%5D';
                }
                console.log(newAccess);
                this.authService.changeAccess(str, newAccess).subscribe(() => {
                  console.log('worked');
                });
              });
            }
          });
      }
      this.copySurveyURL();
      this.ngOnInit();
    });
  }

  copySurveyURL() {
    this.alertify.alert(this.surveyUrl + this.surveyId);
  }

}


