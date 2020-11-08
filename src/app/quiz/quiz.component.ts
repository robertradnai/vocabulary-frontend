import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChoiceQuiz, Question, QuizDialogState, WordListAsChoice } from '../models/ChoiceQuiz';
import { QuizService } from '../quiz-service.service'

const quizStrategy: string = "dummy";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  
  // State-related (non-UI)
  quizBatch: ChoiceQuiz[] = [];
  chosenWordList: WordListAsChoice;
  quizCounter: number = -1;
  questionIsAnswered: boolean = false;
  answers: Map<number, boolean>;

  // UI
  eQuizDialogState = QuizDialogState
  quizDialogState: QuizDialogState = QuizDialogState.Intro;
  batchProgress: string = "0/XXX"
  resultText: string = "";
  nextButtonLabel: string = "Next";
  learningProgress: string = "0%";
  summaryText: string;

  constructor(private quizService: QuizService, private router: Router) { }


  ngOnInit(): void {
    //this.getTestData()

    this.fetchQuizesFromServer()

    // Show initial info while the questions are being fetched


  }

  async fetchQuizesFromServer() {

    this.quizBatch = [];
    // Is a list chosen?
    this.chosenWordList = this.quizService.getChosenWordList()
    console.debug("Stored chosen word list: "+JSON.stringify(this.chosenWordList));
    if(this.chosenWordList == null) {
      // No list chosen
      console.debug("Word list wasn't chosen, redirecting to word list choice...");
      this.router.navigate(["/word-lists"])

    }else {
      // A word list has been chosen

      // Registering the guest user if needed
      console.debug("Stored guest jwt type in pickQuestion: "+(typeof localStorage.getItem("guestJwt")));
      console.debug("Stored guest jwt value in pickQuestion: "+(localStorage.getItem("guestJwt")));
      if (this.quizService.getStoredGuestJwt() === null || this.quizService.getStoredGuestJwt() == "null") {
        console.debug("No guest JWT is found, registering guest user...")   
        console.debug("Guest JWT before registering: "+localStorage.getItem("guestJwt"))
        const res = await this.quizService.postRegisterGuest().toPromise()
        localStorage.setItem("guestJwt", (res as any).guestJwt);
        console.debug("Guest JWT was received and stored: "+localStorage.getItem("guestJwt"))
        await this.quizService.postCloneWordList().toPromise();
        console.debug("Guest user was registered.") 
      } else {
        console.debug("The user is registered, fetching new question...")
      }

      // Fetch a batch of questions
      this.quizService.getPickedQuestion(
        this.chosenWordList.wordCollection, 
        this.chosenWordList.wordList, 
        quizStrategy
      ).subscribe(resPickedQuestions => {
        console.debug("Got choice quiz: "+ JSON.stringify(resPickedQuestions));
        this.quizBatch = resPickedQuestions.quizList;
        this.answers = new Map()

      }, errPickedQuestion => {
        console.warn(JSON.stringify(errPickedQuestion));
        this.quizService.setStoredGuestJwt(null);
        this.router.navigate(["/word-lists"]);
      })
 
    }
  }

  async sendAnswers() {
    let answersJson = {}
    this.answers.forEach((value, key) => {  
      answersJson[key] = value  
    });

    console.log("Sending answers: "+JSON.stringify(answersJson));

    this.quizService.postAnswerQuestion(this.chosenWordList.wordCollection, this.chosenWordList.wordList, answersJson).subscribe(
      content => {
        console.log("Got content from answer-question: "+JSON.stringify(content))
        this.learningProgress = ((content as any).learningProgress*100).toFixed(1)+ " %";
      }
        
    );
  }


  chooseOption(option: string) {
    if (this.questionIsAnswered) {
      console.log("Ignoring output, question has already been answered.")
    }else {
      this.questionIsAnswered = true;
      console.log(option+" was chosen");
      console.log("this.choiceQuiz.flashcard.lang2 "+ this.getCurrentQuizPackage().flashcard.lang2);

      // Evaluating answer
      let is_correct = option == this.getCurrentQuizPackage().flashcard.lang1;
      this.answers.set(this.getCurrentQuizPackage().question.rowKey, is_correct);

      if (is_correct) {
        this.resultText = "Good answer!"
      }else {
        this.resultText = "Incorrect answer!";
        this.quizDialogState = QuizDialogState.Flashcard;
      }
    }
  }

  async onNextButtonClick() {
    
    // Check if there are any questions left, increment quiz counter, load new question
    this.resultText = ""; 
    this.questionIsAnswered = false;
    //this.learningProgress = "";
    
    if(this.quizCounter > this.quizBatch.length) {
      throw new Error("Bad state during quiz!");
    }else if(this.quizCounter + 1 == this.quizBatch.length) {
      // All questions were answered
      // Show summary, send answers and load new questions
      this.quizDialogState = QuizDialogState.Summary
      let correctAnswerCount = Array.from(this.answers.values()).filter(v => v).length;
      let allAnswerCount = Array.from(this.answers.values()).length;
      this.summaryText = "You answered "+correctAnswerCount+" out of the "+allAnswerCount+ " questions correctly.";
      await this.sendAnswers()
      this.fetchQuizesFromServer()
      this.quizCounter = -1;
    }else {
      this.quizCounter += 1;
      if (this.getCurrentQuizPackage().directives.showFlashcard) {
        this.quizDialogState = QuizDialogState.Flashcard;
      }else {
        this.quizDialogState = QuizDialogState.Question;
      }
    }
  }

  // The next button is used for several purposes. 
  // Depending on the state of the application, it can be enabled or disabled
  isNextButtonDisabled(): boolean {
    return !(
      (this.quizDialogState == QuizDialogState.Flashcard 
        || this.quizDialogState == QuizDialogState.Intro 
        || this.quizDialogState == QuizDialogState.Summary 
        || this.questionIsAnswered) 
      && (this.quizBatch.length > 0)
    );
  }

  getBatchProgressLabel() {
    if(this.quizDialogState == QuizDialogState.Flashcard || this.quizDialogState == QuizDialogState.Question) {
      return "Progress in this round: " 
        + (this.quizCounter+1)+"/"+this.quizBatch.length 
        + ", on the whole list: "+this.learningProgress+".";
    }else {
      return "";
    }
  }

  goBack() {
    this.quizService.setStoredGuestJwt(null);
    this.router.navigate(['/word-lists']);
  }

  getCurrentQuizPackage(): ChoiceQuiz {
    return this.quizBatch[this.quizCounter]
  }

  isShowProgressHeader(): boolean {
    return (this.quizDialogState == QuizDialogState.Question || this.quizDialogState == QuizDialogState.Flashcard);
  }
  

}