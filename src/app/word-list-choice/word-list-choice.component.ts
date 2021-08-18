import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedListsResponse, UserListsResponse } from '../models';
import { QuizService } from '../quiz-service.service';
import { AuthService, User } from '../auth.service';

@Component({
  selector: 'app-word-list-choice',
  templateUrl: './word-list-choice.component.html',
  styleUrls: ['./word-list-choice.component.css']
})
export class WordListChoiceComponent implements OnInit {

  constructor(private quizService: QuizService, private router: Router, private authService: AuthService) { }

  available_word_lists: SharedListsResponse[]
  user_word_lists: UserListsResponse[]
  user: User;

  ngOnInit(): void {


    this.authService.user$.subscribe((user: User) => {
      this.quizService.getAvailableWordLists().subscribe(content => {
        this.available_word_lists = content;
      })
      
      this.quizService.getUserWordLists().subscribe(content => {
        this.user_word_lists = content;
      })

      this.user = user;
    });

  }

  async chooseAvailableList(word_list: SharedListsResponse) {
    console.debug(JSON.stringify(word_list)+" was chosen.")
    // Store the chosen list
    //this.quizService.setChosenWordList(word_list);

    // await this.ensureRegistration()
    
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

  async chooseUserList(word_list: UserListsResponse) {
    this.quizService.setChosenWordList(word_list);
    this.router.navigate(['/quiz'])
  }

  async ensureRegistration() {
    // Registering the guest user if needed
    //console.debug("Stored guest jwt type in pickQuestion: "+(typeof this.quizService.getStoredGuestJwt()));
    //console.debug("Stored guest jwt value in pickQuestion: "+(localStorage.getItem("guestJwt")));
    if (this.quizService.getStoredGuestJwt() === null || this.quizService.getStoredGuestJwt() == "null") {
      console.debug("No guest JWT is found, registering guest user...")   
      //console.debug("Guest JWT before registering: "+localStorage.getItem("guestJwt"))
      const res = await this.quizService.postRegisterGuest().toPromise()
      localStorage.setItem("guestJwt", (res as any).guestJwt);
      //console.debug("Guest JWT was received and stored: "+localStorage.getItem("guestJwt"))
      console.debug("Guest user was registered.") 
    } else {
      console.debug("The user is registered, fetching new question...")
    }

  }

}
