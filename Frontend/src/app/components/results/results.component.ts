import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ISurvey } from 'src/app/model/ISurvey.interface';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  toggled = true;
  answered: ISurvey;
  currentUsers: number;
  surveyResults: any;
  resultResponses: any;
  numberOfQuestions: any;
  public surveyId: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.name !== 'Administrator') {
        this.router.navigate(['/home']);
      }
    }

    this.surveyId = this.route.snapshot.params['id'];
    this.authService.getSurvey(this.surveyId).subscribe((data) => {
      this.answered = data;
      if (this.answered.isPublic) {
        this.currentUsers = -1;
        this.authService.getAllUsers().subscribe((data) => {
          for (let i = 0; i < data.length; i++) {
            if (data[i].active === '1') {
              // console.log(data[i].name);
              this.currentUsers += 1;
            }
          }
          console.log(this.currentUsers);
        });
      } else {
        this.authService
          .getSurveyParticipants(this.answered.id)
          .subscribe((particpants) => {
            let newAccess = JSON.stringify(particpants);
            let parts = JSON.parse(newAccess);
            this.currentUsers = parts.length;
          });
      }
    });

    this.authService.getResult(this.surveyId).subscribe((data) => {
      this.surveyResults = data;

      const obj = JSON.parse(this.surveyResults[0].responses);

      this.numberOfQuestions = Object.keys(obj).length;
      this.resultResponses = Array.from(
        { length: this.numberOfQuestions },
        (v, k) => k + 1
      );
    });
  }

  onBack() {
    this.router.navigate(['/survey-detail/' + this.surveyId]); // survey-detail/:id
  }

  chartDetailbar(qNumber) {
    let chartOptions1 = {
      axisX: {
        labelFontWeight: 'bold',
        lineThickness: 7,

        labelFontColor: 'black',
      },
      axisY: {
        labelFontWeight: 'bold',
        lineThickness: 7,
        fontColor: 'black',
        labelFontColor: 'black',
      },
      backgroundColor: 'transparent',
      animationEnabled: true,
      title: {
        text: '',
        fontColor: 'black',
      },
      data: [],
    };
    const obj = JSON.parse(this.surveyResults[0].responses);
    chartOptions1.title.text = Object.keys(obj)[qNumber];
    let count = {};
    for (let i = 0; i < this.surveyResults.length; i++) {
      const obj = JSON.parse(this.surveyResults[i].responses);
      let property = Object.values(obj)[qNumber] as string;
      if (count.hasOwnProperty(property)) {
        count[property] += 1;
      } else {
        count[property] = 1;
      }
    }

    let newlist = [];
    const countArray = Object.entries(count);
    for (let i = 0; i < countArray.length; i++) {
      console.log(countArray[i][0]);
      console.log(countArray[i][1]);
      if (newlist) {
        newlist.push({
          y: countArray[i][1] as number,
          label: countArray[i][0],
        });
      } else {
        newlist = [
          { y: countArray[i][1] as number, label: countArray[i][0] as string },
        ];
      }
    }

    chartOptions1.data = [
      {
        type: 'column',
        backgroundColor: 'transparent',

        indexLabelFontColor: 'black',
        indexLabelFontSize: 17,
        indexLabel: '{y}',
        dataPoints: newlist,
      },
    ];
    return chartOptions1;
  }

  chartDetail(qNumber) {
    let chartOptions1 = {
      backgroundColor: 'transparent',
      animationEnabled: true,
      title: {
        text: '',
      },
      data: [],
    };
    const obj = JSON.parse(this.surveyResults[0].responses);
    let count = {};
    for (let i = 0; i < this.surveyResults.length; i++) {
      const obj = JSON.parse(this.surveyResults[i].responses);
      let property = Object.values(obj)[qNumber] as string;
      if (count.hasOwnProperty(property)) {
        count[property] += 1;
      } else {
        count[property] = 1;
      }
    }

    let newlist = [];
    const countArray = Object.entries(count);
    for (let i = 0; i < countArray.length; i++) {
      if (newlist) {
        newlist.push({
          y: countArray[i][1] as number,
          name: countArray[i][0],
        });
      } else {
        newlist = [{ y: countArray[i][1] as number, name: countArray[i][0] }];
      }
    }

    chartOptions1.data = [
      {
        type: 'pie',
        startAngle: -90,
        indexLabel: '{name}: #percent%',

        toolTipContent: '<b>{label}:</b> {y} (#percent%)',
        backgroundColor: 'transparent',
        indexLabelFontColor: 'black',
        indexLabelFontSize: 17,
        yValueFormatString: '#,###.##',
        dataPoints: newlist,
      },
    ];
    return chartOptions1;
  }

  completed(results) {
    let chartOptions2 = {
      backgroundColor: 'transparent',
      animationEnabled: true,
      title: {
        text: 'Respondents',
        fontColor: 'black',
      },
      data: [],
    };
    let newlist = [{ y: results.length as number, name: 'Responded' }];
    newlist.push({
      y: (this.currentUsers - results.length) as number,
      name: 'Not Responded',
    });
    chartOptions2.data = [
      {
        type: 'doughnut',
        startAngle: 60,
        indexLabelFontSize: 17,
        backgroundColor: 'transparent',
        indexLabelFontColor: 'black',

        indexLabel: '{name} - {y}',
        toolTipContent: '<b>{label}:</b> {y} (#percent%)',
        dataPoints: newlist,
      },
    ];
    return chartOptions2;
  }

  turnOff() {
    this.toggled = false;
  }

  public openPDF(): void {
    html2canvas(document.body).then((canvas) => {
      var dataURL = canvas.toDataURL();
      var pdf = new jsPDF();
      pdf.addImage(dataURL, 'JPEG', 20, 20, 170, 120); //addImage(image, format, x-coordinate, y-coordinate, width, height)
      pdf.save('CanvasJS Charts.pdf');
    });
    this.toggled = true;
  }
}
