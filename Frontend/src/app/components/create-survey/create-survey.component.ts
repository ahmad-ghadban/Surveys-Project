import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import { Survey } from 'src/app/model/survey';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css'],
})
export class CreateSurveyComponent implements OnInit {
  surveyUrl = environment.surveyUrl;
  myControl = new FormControl('');
  filteredOptions: Observable<string[]>;
  surveyForm: FormGroup;
  surveyData: any = {};
  survey = new Survey();
  surveyid: any;
  userList = [];
  editIcon = faPenToSquare;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.name !== 'Administrator') {
        this.router.navigate(['/home']);
      }
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    this.authService.getAllUsers().subscribe((data) => {
      for (let i = 1; i < data.length; i++) {
        if (data[i].active === '1') {
          this.userList.push(data[i].name);
        }
      }
      console.log(this.userList);
    });
    this.initForm();
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.userList.filter((street) =>
      this._normalizeValue(street).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  private initForm() {
    this.surveyForm = this.fb.group({
      surveyTitle: ['', Validators.required],
      surveyDescription: ['', Validators.required],
      isPublic: ['', Validators.required],
      participants: this.fb.array([]),
      deadline: [{ value: 4832283600000, disabled: true }],
      surveyQuestions: this.fb.array([], Validators.required),
    });

    this.onAddQuestion();
  }

  onAddQuestion() {
    const surveyQuestionItem = this.fb.group({
      questionTitle: ['', Validators.required],
      options: this.fb.array([this.fb.control('', Validators.required)]),
    });

    (<FormArray>this.surveyForm.get('surveyQuestions')).push(
      surveyQuestionItem
    );

    // this.addOption(0);
  }

  onRemoveQuestion(index) {
    (<FormArray>this.surveyForm.get('surveyQuestions')).removeAt(index);
  }

  addOption(index) {
    this.surveyForm.controls['surveyQuestions']['controls'][
      index
    ].controls.options.push(this.fb.control('', Validators.required));
  }

  removeOption(questionIndex, optionIndex) {
    this.surveyForm.controls['surveyQuestions']['controls'][
      questionIndex
    ].controls.options.removeAt(optionIndex);
  }

  addParticipant(name) {
    (<FormArray>this.surveyForm.controls['participants']).push(
      this.fb.control(name)
    );
  }

  mapSurvey() {
    this.survey.name = this.surveyForm.controls['surveyTitle'].value;
    this.survey.description =
      this.surveyForm.controls['surveyDescription'].value;
    this.survey.isPublic = JSON.parse(
      this.surveyForm.controls['isPublic'].value
    );
    this.survey.participants = JSON.stringify(
      this.surveyForm.controls['participants'].value
    );
    if (typeof this.surveyForm.controls['deadline'].value === 'number') {
      this.survey.deadline = '4832283600000';
    } else {
      this.survey.deadline = this.surveyForm.controls['deadline'].value
        .getTime()
        .toString();
    }

    this.survey.questions = this.questionsOptionsToString();
  }

  questionsOptionsToString() {
    let questionForBackend = [];
    for (let question of this.surveyForm.controls['surveyQuestions'][
      'controls'
    ]) {
      let questionResponsesDict = {};
      // console.log(x.get('questionTitle').value);
      let responses = [];
      for (var response of question.controls.options.controls) {
        responses = [...responses, response.value];
      }
      questionResponsesDict[question.get('questionTitle').value] =
        question.get('options').value;
      questionForBackend.push(questionResponsesDict);
    }
    return JSON.stringify(questionForBackend);
  }

  // let questionForBackend = [];
  // let questionResponsesDict = {};
  // for (var question of this.surveyForm.controls['surveyQuestions'][
  //   'controls'
  // ]) {
  // console.log(x.get('questionTitle').value);
  // let responses = [];
  // for (var response of question.controls.options.controls) {
  //   responses = [...responses, response.value];
  // console.log(y);
  // }
  // console.log(x);
  //   questionResponsesDict[question.get('questionTitle').value] = responses;
  //   questionForBackend.push(questionResponsesDict);
  // }
  // return JSON.stringify(questionForBackend);

  deadlineValidation = (d: Date | null): boolean => {
    if (d) {
      return d.valueOf() > new Date().valueOf();
    } else {
      return true;
    }
  };

  onPublish() {
    this.survey.published = true;
    this.onSubmit();
  }

  postSurvey() {
    this.mapSurvey();

    let createdSurvey: Survey = {
      name: this.survey.name,
      description: this.survey.description,
      questions: this.survey.questions,
      participants: this.survey.participants,
      deadline: this.survey.deadline.toString(),
      published: this.survey.published,
      isPublic: this.survey.isPublic,
    };
    console.log(createdSurvey);

    this.authService.addSurvey(createdSurvey).subscribe(
      () => {
        if (createdSurvey.published) {
          // if (createdSurvey.isPublic) {
          //   this.authService.getAllUsers().subscribe((data) => {
          //     for (let i = 0; i < data.length; i++) {
          //       console.log(data[i].name);
          //       console.log(data[i].access);
          //       this.authService
          //         .getSurveyID(createdSurvey.name)
          //         .subscribe((surveysid) => {
          //           let surveyid = surveysid;
          //           console.log(surveyid);
          //           this.authService
          //             .getUserAccess(data[i].name.toString())
          //             .subscribe((oldAccess) => {
          //               console.log(oldAccess);
          //               if (oldAccess === '') {
          //                 var newAccess = '%5B' + surveyid + '%5D';
          //               } else {
          //                 var newAccess = JSON.stringify(oldAccess);
          //                 var objString =
          //                   '?' + new URLSearchParams(newAccess).toString();
          //                 newAccess =
          //                   objString.slice(1, -4) + '%2C' + surveyid + '%5D';
          //               }
          //               console.log(newAccess);
          //               this.authService
          //                 .changeAccess(data[i].name.toString(), newAccess)
          //                 .subscribe(() => {
          //                   console.log('yay');
          //                 });
          //             });
          //         });
          //     }
          //   });
          // }
          if (!createdSurvey.isPublic) {
            this.authService
              .getSurveyID(createdSurvey.name)
              .subscribe((surveysid) => {
                this.surveyid = surveysid;
                console.log(createdSurvey.participants);
                var part = createdSurvey.participants;
                part = part.slice(1, -1);
                var newPart = part.split(',');
                for (let i = 0; i < newPart.length; i++) {
                  let str = newPart[i].replace(/^"(.*)"$/, '$1');
                  console.log(str);
                  this.authService.getUserAccess(str).subscribe((oldAccess) => {
                    console.log(oldAccess);
                    if (oldAccess === '') {
                      var newAccess = '%5B' + this.surveyid + '%5D';
                    } else {
                      var newAccess = JSON.stringify(oldAccess);
                      var objString =
                        '?' + new URLSearchParams(newAccess).toString();
                      newAccess =
                        objString.slice(1, -4) + '%2C' + this.surveyid + '%5D';
                    }
                    console.log(newAccess);
                    this.authService
                      .changeAccess(str, newAccess)
                      .subscribe(() => {
                        console.log('worked');
                      });
                  });
                }
                this.showLink(this.surveyid);
              });
          }
          this.authService
            .getSurveyID(createdSurvey.name)
            .subscribe((surveysid) => {
              this.surveyid = surveysid;
              this.showLink(this.surveyid);
            });
        }

        this.router.navigate(['/dashboard']);
        this.alertify.success('Survey Created!');
      },
      (error) => {
        this.alertify.error(error.error);
      }
    );
  }

  showLink(id) {
    this.alertify.alert(this.surveyUrl + id);
  }

  onSubmit() {
    this.postSurvey();
  }
}
