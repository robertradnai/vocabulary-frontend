import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PickQuestionsResponse, SharedListsResponse, UserListsResponse } from './models'

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  pickedWordCollection: string;
  pickedWordList: string;
  
  constructor(private http: HttpClient, private router: Router) { }

  // Webpage access functions
  getAvailableWordLists(): Observable<SharedListsResponse[]> {
    const url = '/api/vocabulary/shared-lists'
    return this.http.get<SharedListsResponse[]>(url)
      .pipe(tap(res => console.log(`${url} response: ${JSON.stringify(res)}`)));
  }

  getUserWordLists(): Observable<UserListsResponse[]> {
    const url = '/api/vocabulary/user-lists'
    return this.http.get<UserListsResponse[]>(url)
      .pipe(tap(res => console.log(`${url} response: ${JSON.stringify(res)}`)));
  }

  postRegisterGuest() {
    return this.http.post<any>('/api/vocabulary/auth/register-guest', null, {});
  }

  postCloneWordList(availableWordListId: number) {
    const params = new HttpParams()
      .set("availableWordListId", availableWordListId.toString())
    return this.http.post<any>('/api/vocabulary/clone-word-list', null, {params: params});
  }

  getPickedQuestion(wordListId: number, quizStrategy: string): Observable<PickQuestionsResponse> {
    const params = new HttpParams()
      .set("userWordListId", wordListId.toString())
      .set("wordPickStrategy", quizStrategy); 

    const headers: HttpHeaders = new HttpHeaders();
    const options = { params: params, headers: headers };
    const url = '/api/vocabulary/pick-question'
    return this.http.get<PickQuestionsResponse>(url, options)
      .pipe(tap(res => console.log(`${url} response: ${JSON.stringify(res)}`)));
  }

  postAnswerQuestion(wordListId: number, answers) {

    const url = '/api/vocabulary/answer-question'
    const params = new HttpParams()
      .set("userWordListId", wordListId.toString()); 
    const headers: HttpHeaders = new HttpHeaders();
    const options = { params: params, headers: headers };

    console.log("Sending answers: "+JSON.stringify(answers));

    return this.http.post(url, {"answers": answers} , options)
    .pipe(tap(res => console.log(`${url} response: ${JSON.stringify(res)}`)));
  }


  submitFeedback(formData: FormData) {
    //const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });
    const options = { params: null, headers: null };

    return this.http.post('/api/vocabulary/feedback-or-subscribe', formData, options);
  }

  //Local storage functions
  setChosenWordList(word_list: SharedListsResponse) {
    localStorage.setItem("chosenWordList", JSON.stringify(word_list));
  }
  getChosenWordList(): SharedListsResponse {
    return JSON.parse(localStorage.getItem("chosenWordList"))
  }
  getStoredGuestJwt(): string {
    const jwt = localStorage.getItem("guestJwt");
    console.debug(`Got locally stored guest jwt: ${jwt}`);
    return jwt;
  }
  setStoredGuestJwt(guestJwt): void {
    localStorage.setItem("guestJwt", guestJwt);
    console.debug(`Set locally stored guest jwt: ${guestJwt}`);
  }
}

interface FlaskLoginAccepted {
  
}