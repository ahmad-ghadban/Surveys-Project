import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/backend.service';
import { IResult } from './IResult.interface';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ISurvey } from '../../model/ISurvey.interface';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css'],
})
export class SurveyComponent implements OnInit {
  public surveyId: number;
  @Input() survey: ISurvey = {
    id: 0,
    name: '',
    description: '',
    questions: [],
    deadline: 0,
    published: false,
    isPublic: false,
  };
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.surveyId = this.route.snapshot.params['id'];
    this.authService.getSurvey(this.surveyId).subscribe((data) => {
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
    });
  }

  onSubmit(form: NgForm) {
    const user = JSON.parse(localStorage.getItem('user') as string);
    this.authService.getUserId(user.name).subscribe((data) => {
      const id = data.toString();
      let result: IResult = {
        userId: parseInt(id),
        surveyId: this.surveyId,
        responses: JSON.stringify(form.value),
      };

      this.authService.addResult(result).subscribe(
        () => {
          this.authService
            .getUserCompleted(user.name)
            .subscribe((oldAccess) => {
              console.log(oldAccess);
              if (oldAccess === '') {
                var newAccess = '%5B' + this.surveyId + '%5D';
              } else {
                var newAccess = JSON.stringify(oldAccess);
                var objString = '?' + new URLSearchParams(newAccess).toString();
                newAccess =
                  objString.slice(1, -4) + '%2C' + this.surveyId + '%5D';
              }
              console.log(newAccess);
              this.authService
                .changeCompleted(user.name, newAccess)
                .subscribe(() => {
                  console.log('worked');
                });
            });
          this.authService
            .getSurveyRespondents(this.surveyId)
            .subscribe((oldRes) => {
              this.authService.getUserId(user.name).subscribe((data) => {
                const id = data.toString();
                let usersID = parseInt(id);

                if (oldRes === '') {
                  var newAccess = '%5B' + usersID + '%5D';
                } else {
                  var newAccess = JSON.stringify(oldRes);
                  var objString =
                    '?' + new URLSearchParams(newAccess).toString();
                  newAccess = objString.slice(1, -4) + '%2C' + usersID + '%5D';
                }
                this.authService
                  .changeRespondents(this.surveyId, newAccess)
                  .subscribe(() => {
                    console.log('worked yay');
                  });
              });
            });
          this.alertify.success('Survey Completed!');
          this.router.navigate(['/home']);
        },
        (error) => {
          this.alertify.error(error.error);
        }
      );
      console.log(result);
    });
  }
}
