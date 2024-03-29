import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PickQuestionsResponse, MultipleChoiceQuiz, QuizDialogState, SharedListsResponse, QuizEntry } from '../models';
import { QuizService } from '../quiz-service.service'

const quizStrategy: string = "dummy";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  
  // State-related (non-UI)
  //quizBatch: ChoiceQuiz[] = [];
  chosenWordList: SharedListsResponse;
  quizCounter: number = -1;
  questionIsAnswered: boolean = false;
  answers: Map<number, boolean>;
  isAnswerCorrect = false;
  pickedAnswer: string ='';
  pickedQuestionsResponse: PickQuestionsResponse;

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

    this.pickedQuestionsResponse = null;
    // Is a list chosen?
    this.chosenWordList = this.quizService.getChosenWordList()
    console.debug("Stored chosen word list: "+JSON.stringify(this.chosenWordList));
    if(this.chosenWordList == null) {
      // No list chosen
      console.debug("Word list wasn't chosen, redirecting to word list choice...");
      this.router.navigate(["/word-lists"])

    }else {
      // A word list has been chosen
      this.nextButtonLabel = "Loading..."
      // Fetch a batch of questions
      this.quizService.getPickedQuestion(
        this.chosenWordList.userWordListId, 
        quizStrategy
      ).toPromise().then(resPickedQuestions => {
        this.pickedQuestionsResponse = resPickedQuestions
        //this.quizBatch = resPickedQuestions.quizList;
        this.answers = new Map()
        this.nextButtonLabel = "Next"
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

    await this.quizService.postAnswerQuestion(this.chosenWordList.userWordListId, answersJson)
      .toPromise().then(
      content => {
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

      // Evaluating answer
      let option_index = this.getCurrentQuizPackage().question.options.indexOf(option)
      this.isAnswerCorrect = this.getCurrentQuizPackage().question.correctAnswerIndices.indexOf(option_index) != -1;

      this.pickedAnswer = option;
      this.answers.set(this.getCurrentQuizPackage().question.rowKey, this.isAnswerCorrect);

      if (this.isAnswerCorrect) {
        this.resultText = "Good answer!"
      }else {
        this.resultText = "Incorrect answer!";
        //this.quizDialogState = QuizDialogState.Flashcard;
      }
    }
  }

  isAnsweredAndCorrect(option: string): boolean {

    let option_index = this.getCurrentQuizPackage().question.options.indexOf(option)
    let isOptionCorrect = this.getCurrentQuizPackage().question.correctAnswerIndices.indexOf(option_index) != -1;

    console.log("isAnsweredAndCorrect called with input "+option+
            ", returning "+(this.questionIsAnswered && isOptionCorrect));
    return this.questionIsAnswered && isOptionCorrect;
  }

  isAnsweredAndWrong(option: string): boolean {
    let isOptionPicked = option == this.pickedAnswer;
    return (this.questionIsAnswered && isOptionPicked && !this.isAnswerCorrect);
  }

  async onNextButtonClick() {
    
    // Check if there are any questions left, increment quiz counter, load new question
    this.resultText = ""; 
    this.questionIsAnswered = false;
    //this.learningProgress = "";
    
    if(this.quizCounter > this.pickedQuestionsResponse.quizList.length) {
      throw new Error("Bad state during quiz!");
    }else if(this.quizCounter + 1 == this.pickedQuestionsResponse.quizList.length) {
      // All questions were answered
      // Show summary, send answers and load new questions
      this.quizDialogState = QuizDialogState.Summary
      let correctAnswerCount = Array.from(this.answers.values()).filter(v => v).length;
      let allAnswerCount = Array.from(this.answers.values()).length;
      this.summaryText = "You answered "+correctAnswerCount+" out of the "+allAnswerCount+ " questions correctly.";
      await this.sendAnswers()
      await this.fetchQuizesFromServer()
      this.quizCounter = -1;
    }else {
      this.quizCounter += 1;
      if (this.getCurrentQuizPackage().question != null) {
        this.quizDialogState = QuizDialogState.Question;
      }else {
        this.quizDialogState = QuizDialogState.Flashcard;
      }
    }
  }

  // The next button is used for several purposes. 
  // Depending on the state of the application, it can be enabled or disabled
  isNextButtonDisabled(): boolean {
    return !(
      (this.quizDialogState == QuizDialogState.Flashcard 
        || this.quizDialogState == QuizDialogState.Intro 
        || ((this.quizDialogState == QuizDialogState.Summary) && (this.quizCounter == -1))
        || this.questionIsAnswered) 
      && (this.pickedQuestionsResponse != null)
    );
  }

  isQuizChoiceButtonDisabled(): boolean {
    return this.questionIsAnswered;
  }

  getBatchProgressLabel() {
    if(this.quizDialogState == QuizDialogState.Flashcard || this.quizDialogState == QuizDialogState.Question) {
      return "" 
        + (this.quizCounter+1)+"/"+this.pickedQuestionsResponse.quizList.length 
        + " | "+this.learningProgress+" overall";
    }else {
      return "";
    }
  }

  goBack() {
    this.router.navigate(['/word-lists']);
  }

  getCurrentQuizPackage(): QuizEntry {
    return this.pickedQuestionsResponse.quizList[this.quizCounter]
  }

  isShowProgressHeader(): boolean {
    return (this.quizDialogState == QuizDialogState.Question || this.quizDialogState == QuizDialogState.Flashcard);
  }
  

}
