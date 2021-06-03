import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PickQuestionsResponse, SharedListsResponse } from './models'

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  pickedWordCollection: string;
  pickedWordList: string;
  
  constructor(private http: HttpClient, private router: Router) { }

  // Webpage access functions
  getWordLists(): Observable<SharedListsResponse[]> {
    return this.http.get<SharedListsResponse[]>('/api/vocabulary/shared-lists')
  }
  postRegisterGuest() {
    return this.http.post<any>('/api/vocabulary/register-guest', null, {});
  }
  postCloneWordList() {
    const params = new HttpParams()
      .set("availableWordListId", this.getChosenWordList().wordListId.toString())
    return this.http.post<any>('/api/vocabulary/clone-word-list', null, {params: params});
  }

  getPickedQuestion(wordListId: number, quizStrategy: string) {
    const params = new HttpParams()
      .set("userWordListId", wordListId.toString())
      .set("wordPickStrategy", quizStrategy); 

    const headers: HttpHeaders = new HttpHeaders()
    const options = { params: params, headers: headers };
    return this.http.get<PickQuestionsResponse>('/api/vocabulary/pick-question', options);
  }

  postAnswerQuestion(wordListId: number, answers) {
    const params = new HttpParams()
      .set("userWordListId", wordListId.toString()); 

    const headers: HttpHeaders = new HttpHeaders();
    const options = { params: params, headers: headers };
    return this.http.post('/api/vocabulary/answer-question', {"answers": answers} , options);
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
  getStoredGuestJwt() {
    return localStorage.getItem("guestJwt");
  }
  setStoredGuestJwt(guestJwt) {
    return localStorage.setItem("guestJwt", guestJwt)
  }
}

interface FlaskLoginAccepted {
  
}