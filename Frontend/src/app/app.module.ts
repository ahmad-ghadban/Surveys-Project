import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AlertifyService } from './services/alertify.service';
import { AuthService } from './services/backend.service';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SurveyComponent } from './components/survey/survey.component';
import { SurveyListComponent } from './components/survey-list/survey-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { EditNameComponent } from './components/edit-name/edit-name.component';
import { EditPasswordComponent } from './components/edit-password/edit-password.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CreateSurveyComponent } from './components/create-survey/create-survey.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ResultsComponent } from './components/results/results.component';
import * as CanvasJSAngularChart from '../assets/canvasjs.angular.component';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { SurveyDetailComponent } from './components/survey-detail/survey-detail.component';
import { StarsBackgroundComponent } from './components/stars-background/stars-background.component';

const appRoutes: Routes = [
  { path: '', component: UserLoginComponent },
  { path: 'home', component: UserDashboardComponent },

  { path: 'survey/:id', component: SurveyComponent },
  { path: 'results/:id', component: ResultsComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'registration', component: UserRegisterComponent },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'create-survey', component: CreateSurveyComponent },
  { path: 'survey-detail/:id', component: SurveyDetailComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    CreateSurveyComponent,
    UserLoginComponent,
    NavbarComponent,
    ResultsComponent,
    CanvasJSChart,
    SurveyComponent,
    SurveyListComponent,
    SurveyDetailComponent,

    ManageUsersComponent,
    UserRegisterComponent,
    EditNameComponent,
    EditPasswordComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    StarsBackgroundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule.forRoot(appRoutes),

    MatGridListModule,
    MatCardModule,
    MatAutocompleteModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonToggleModule,
  ],
  providers: [AuthService, AlertifyService],
  bootstrap: [AppComponent],
})
export class AppModule {}
