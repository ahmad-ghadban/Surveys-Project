import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IUser } from '../model/IUser.interface';
import { Observable } from 'rxjs';
import { IResult } from '../components/survey/IResult.interface';
import { ISurvey } from '../model/ISurvey.interface';
import { Survey } from '../model/survey';
import { IGetUsers } from '../model/IGetUsers.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  authUser(user: IUser) {
    return this.http.post(this.baseUrl + '/account/login', user);
  }

  getAllUsers() {
    return this.http.get<IGetUsers[]>(this.baseUrl + '/account');
  }

  getUserAccess(name: string) {
    return this.http.get(this.baseUrl + '/account/access/' + name);
  }
  getUserCompleted(name: string) {
    return this.http.get(this.baseUrl + '/account/completed/' + name);
  }

  addUser(user: IUser) {
    return this.http.post(this.baseUrl + '/account/register', user);
  }

  changeAccess(name: string, access: string) {
    return this.http.put(
      this.baseUrl + '/account/editAccess/' + name + '?access=' + access,
      null
    );
  }

  changeCompleted(name: string, completed: string) {
    return this.http.put(
      this.baseUrl +
        '/account/editCompleted/' +
        name +
        '?completed=' +
        completed,
      null
    );
  }

  changeRespondents(id: number, respondents: string) {
    return this.http.put(
      this.baseUrl +
        '/survey/editRespondents/' +
        id +
        '?respondents=' +
        respondents,
      null
    );
  }

  deactivateUser(username: string) {
    return this.http.put(
      this.baseUrl + '/account/deactivate/' + username,
      null
    );
  }

  activateUser(username: string) {
    return this.http.put(this.baseUrl + '/account/activate/' + username, null);
  }

  editUserName(id: number, username: string) {
    return this.http.put(
      this.baseUrl + '/account/editName/' + id + '?name=' + username,
      null
    );
  }

  editPassword(id: number, password: string) {
    return this.http.put(
      this.baseUrl + '/account/editPassword/' + id + '?password=' + password,
      null
    );
  }

  getResult(id: number) {
    return this.http.get(this.baseUrl + '/results/' + id);
  }

  getAllSurveys() {
    return this.http.get<ISurvey[]>(this.baseUrl + '/survey/');
  }

  getSurvey(id: number) {
    return this.http.get<ISurvey>(this.baseUrl + '/survey/' + id);
  }

  getSurveyID(name: string) {
    return this.http.get(this.baseUrl + '/survey/id/' + name);
  }

  getSurveyRespondents(id: number) {
    return this.http.get(this.baseUrl + '/survey/respondants/' + id);
  }

  getSurveyParticipants(id: number) {
    return this.http.get(this.baseUrl + '/survey/participants/' + id);
  }

  addSurvey(survey: Survey) {
    return this.http.post(this.baseUrl + '/survey/add', survey);
  }

  getUserId(name: string) {
    return this.http.get(this.baseUrl + '/account/' + name);
  }

  addResult(result: IResult) {
    return this.http.post(this.baseUrl + '/results/add', result);
  }

  deleteSurvey(surveyID: number) {
    return this.http.delete(this.baseUrl + '/survey/delete/' + surveyID);
  }

  publishSurvey(surveyID: number) {
    return this.http.put(this.baseUrl + '/survey/publish/' + surveyID, null);
  }

}
