import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { LoginComponent } from './login/login.component';
import { QuizComponent } from './quiz/quiz.component';
import { WordListChoiceComponent } from './word-list-choice/word-list-choice.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'word-lists', component: WordListChoiceComponent},
  { path: '', component: QuizComponent},
  { path: 'quiz', component: QuizComponent}
  //{ path: 'word-lists', component: WordListChoiceComponent}
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
