import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChoiceQuiz, WordListAsChoice, PickQuestionsResponse } from './models/ChoiceQuiz'

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  pickedWordCollection: string;
  pickedWordList: string;
  
  constructor(private http: HttpClient, private router: Router) { }

  // Webpage access functions
  getWordLists() {
    return this.http.get<WordListAsChoice[]>('http://127.0.0.1:5000/api/vocabulary/shared-lists')
  }
  getTestContent() {
    return this.http.get('http://127.0.0.1:5000/')
  }
  getUnauthContent() {
    return this.http.get('http://127.0.0.1:5000/hello')
  }
  postRegisterGuest() {
    return this.http.post<any>('http://127.0.0.1:5000/api/vocabulary/register-guest', null, {});
  }
  postCloneWordList() {
    const params = new HttpParams()
      .set("wordCollection", this.getChosenWordList().wordCollection)
    return this.http.post<any>('http://127.0.0.1:5000/api/vocabulary/clone-word-list', null, {params: params});
  }

  getPickedQuestion(wordCollection: string, wordList: string, quizStrategy: string) {
    const params = new HttpParams()
      .set("wordCollection", wordCollection)
      .set("wordList", wordList)
      .set("wordPickStrategy", quizStrategy); 

    const headers: HttpHeaders = new HttpHeaders()
    const options = { params: params, headers: headers };
    return this.http.get<PickQuestionsResponse>('http://127.0.0.1:5000/api/vocabulary/pick-question', options);
  }

  postAnswerQuestion(wordCollection: string, wordList: string, rowId: number, isCorrect: boolean) {
    const params = new HttpParams()
    .set("wordCollection", wordCollection)
    .set("wordList", wordList)
    .set("rowId", rowId.toString())
    .set("isCorrect", isCorrect.toString()); 

    const headers: HttpHeaders = new HttpHeaders()
    const options = { params: params, headers: headers };
    return this.http.post('http://127.0.0.1:5000/api/vocabulary/answer-question', null, options);
  }



  //Local storage functions
  setChosenWordList(word_list: WordListAsChoice) {
    localStorage.setItem("chosenWordList", JSON.stringify(word_list));
  }
  getChosenWordList(): WordListAsChoice {
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