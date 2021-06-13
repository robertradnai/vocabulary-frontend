import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedListsResponse } from '../models';
import { QuizService } from '../quiz-service.service';

@Component({
  selector: 'app-word-list-choice',
  templateUrl: './word-list-choice.component.html',
  styleUrls: ['./word-list-choice.component.css']
})
export class WordListChoiceComponent implements OnInit {

  constructor(private quizService: QuizService, private router: Router) { }

  word_lists: SharedListsResponse[]

  ngOnInit(): void {
    this.quizService.getWordLists().subscribe(content => {
      console.log("Received word lists: "+JSON.stringify(content))
      this.word_lists = content;

    })
  }

  async chooseList(word_list: SharedListsResponse) {
    console.debug(JSON.stringify(word_list)+" was chosen.")
    // Store the chosen list
    //this.quizService.setChosenWordList(word_list);

    this.quizService.setStoredGuestJwt(null);
    await this.ensureRegistration()
    
    await this.quizService.postCloneWordList(word_list.availableWordListId)
      .toPromise()
      .then(resCloneList => {
        console.debug("Cloned list info: "+ JSON.stringify(resCloneList));
        this.quizService.setChosenWordList(resCloneList);
        this.router.navigate(['/quiz'])
      }, errPickedQuestion => {
        console.warn(JSON.stringify(errPickedQuestion));
        this.quizService.setStoredGuestJwt(null);
        // this.router.navigate(["/word-lists"]);
      }) 
  }

  async ensureRegistration() {
    // Registering the guest user if needed
    console.debug("Stored guest jwt type in pickQuestion: "+(typeof localStorage.getItem("guestJwt")));
    console.debug("Stored guest jwt value in pickQuestion: "+(localStorage.getItem("guestJwt")));
    if (this.quizService.getStoredGuestJwt() === null || this.quizService.getStoredGuestJwt() == "null") {
      console.debug("No guest JWT is found, registering guest user...")   
      console.debug("Guest JWT before registering: "+localStorage.getItem("guestJwt"))
      const res = await this.quizService.postRegisterGuest().toPromise()
      localStorage.setItem("guestJwt", (res as any).guestJwt);
      console.debug("Guest JWT was received and stored: "+localStorage.getItem("guestJwt"))
      console.debug("Guest user was registered.") 
    } else {
      console.debug("The user is registered, fetching new question...")
    }

  }

}
