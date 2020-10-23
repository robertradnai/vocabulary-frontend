import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChoiceQuiz, Question, QuizDialogState, WordListAsChoice } from '../models/ChoiceQuiz';
import { QuizService } from '../quiz-service.service'

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  choiceQuiz: ChoiceQuiz;
  choiceQuizString: string;

  question: Question;

  showFlashcard: boolean = true;
  showResult: boolean =  false;
  resultText: string = "";
  learningProgress: string = "";

  quizList: ChoiceQuiz[]
  quizCounter: number; // It starts with 1
  quizLength: number;

  wordCollection: string = null;
  wordList: string = null;
  wordListDisplayName: string = null;

  quizStrategy: string = "dummy"

  questionIsAnswered: boolean = false;
  quizDialogState: String = "intro";
  

  constructor(private quizService: QuizService, private router: Router) { }

  ngOnInit(): void {
    //this.getTestData()

    this.pickQuestion()

  }

  async pickQuestion() {

    // Is a list chosen?
    const chosenWordList: WordListAsChoice = this.quizService.getChosenWordList()
    console.debug("Stored chosen word list: "+JSON.stringify(chosenWordList));
    if(chosenWordList == null) {
      // No list chosen
      console.debug("Word list wasn't chosen, redirecting to word list choice...");
      this.router.navigate(["/word-lists"])

    }else {
      // We already have a list
      this.wordCollection = chosenWordList.wordCollection;
      this.wordList = chosenWordList.wordList;
      this.wordListDisplayName = chosenWordList.wordListDisplayName;



      // Registering the guest user if needed
      console.debug("Stored guest jwt type in pickQuestion: "+(typeof localStorage.getItem("guestJwt")));
      console.debug("Stored guest jwt value in pickQuestion: "+(localStorage.getItem("guestJwt")));
      if (this.quizService.getStoredGuestJwt() === null || this.quizService.getStoredGuestJwt() == "null") {
        console.debug("No guest JWT is found, registering guest user...")
        
          console.log("Guest JWT before registering: "+localStorage.getItem("guestJwt"))
          const res = await this.quizService.postRegisterGuest().toPromise()
          localStorage.setItem("guestJwt", (res as any).guestJwt);
          console.log("Guest JWT was received and stored: "+localStorage.getItem("guestJwt"))
          await this.quizService.postCloneWordList().toPromise();
          console.debug("Guest user was registered.")
        
      } else {
        console.debug("The user is registered, fetching new question...")
      }

      this.quizService.getPickedQuestion(
        chosenWordList.wordCollection, 
        chosenWordList.wordList, 
        "dummystrategy"
      ).subscribe(resPickedQuestion => {
        console.log("Got choice quiz: "+ JSON.stringify(resPickedQuestion));

        this.quizList = resPickedQuestion.quizList;
        ////////////////////////////
        //this.quizList.shift();

        //this.choiceQuizString = JSON.stringify(resPickedQuestion);
        //this.question = this.choiceQuiz.question;
        //this.showFlashcard = this.choiceQuiz.showFlashcard;
        
        // this.learningProgress = (this.choiceQuiz.learningProgress*100).toFixed(1).toString()+" %";

        //if (this.showFlashcard) {
        //  this.sendAnswer(true) // When a flashcard is shown, send positive answer automatically
        //}
        // TODO redirect to main page on error
      }, errPickedQuestion => {
        console.warn(JSON.stringify(errPickedQuestion));
        this.quizService.setStoredGuestJwt(null);
        this.router.navigate(["/word-lists"]);
      })
 
    }
    /*
    this.quizService.getTestContent().subscribe(
      content => {console.log("Got authorized content: "+ JSON.stringify(content))}
    )
    this.quizService.getUnauthContent().subscribe(
      content => {console.log(")Got public content: "+ JSON.stringify(content))}
    )*/
  }

  pickOption(option: string) {
    if (this.questionIsAnswered) {
      console.log("Ignoring output, question has already been answered.")
    }else {
      console.log(option+" was chosen");
      this.showResult = true;
      console.log("Option: " +option);
      console.log("this.choiceQuiz.flashcard.lang2 "+ this.choiceQuiz.flashcard.lang2)
      if (option == this.choiceQuiz.flashcard.lang1) {
        this.resultText = "Good answer!"
        this.sendAnswer(true)

      }else {
        this.resultText = "Incorrect answer! The correct answer is: "+ this.choiceQuiz.flashcard.lang1;
        this.showFlashcard = true;
        this.sendAnswer(false)
      }
    }
    
   
  }

  sendAnswer(isCorrect: boolean) {
    this.quizService.postAnswerQuestion(this.wordCollection, this.wordList, this.question.rowKey, isCorrect).subscribe(
      content => {console.log("Got content from answer-question: "+JSON.stringify(content))}
    );
  }

  nextQuestion() {
    // Check if there are any questions left, increment quiz counter, load new question
    if(this.quizCounter > this.quizList.length) {
      throw new Error("Bad state during quiz!");
    }else if(this.quizCounter == this.quizList.length) {
      // All questions were answered, show dialogue
      
    }else {
      this.pickQuestion();
      this.showResult = false;
    }
    

  }

  goBack() {
    this.quizService.setStoredGuestJwt(null);
    this.router.navigate(['/word-lists']);
  }

}
