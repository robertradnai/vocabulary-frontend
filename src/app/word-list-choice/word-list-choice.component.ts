import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WordListAsChoice } from '../models';
import { QuizService } from '../quiz-service.service';

@Component({
  selector: 'app-word-list-choice',
  templateUrl: './word-list-choice.component.html',
  styleUrls: ['./word-list-choice.component.css']
})
export class WordListChoiceComponent implements OnInit {

  constructor(private quizService: QuizService, private router: Router) { }

  word_lists: WordListAsChoice[]

  ngOnInit(): void {
    this.quizService.getWordLists().subscribe(content => {
      console.log("Received word lists: "+JSON.stringify(content))
      this.word_lists = content;

    })
  }

  chooseList(word_list: WordListAsChoice) {
    console.debug(JSON.stringify(word_list)+" was chosen.")
    // Store the chosen list
    this.quizService.setChosenWordList(word_list);
    this.quizService.setStoredGuestJwt(null);
    this.router.navigate(['/quiz'])
  }

}
