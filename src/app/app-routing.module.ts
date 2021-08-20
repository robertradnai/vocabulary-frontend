import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AboutComponent } from './about/about.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { QuizComponent } from './quiz/quiz.component';
import { WordListChoiceComponent } from './word-list-choice/word-list-choice.component';
import { AuthGuard } from './auth.guard.service';


const routes: Routes = [
  // { path: 'word-lists', component: WordListChoiceComponent, canActivate: [AuthGuard]},
  { path: '', component: WordListChoiceComponent},
  { path: 'quiz', component: QuizComponent, canActivate: [AuthGuard]},
  // { path: 'contact', component: FeedbackComponent},
  //{ path: 'about', component: AboutComponent}
  //{ path: 'word-lists', component: WordListChoiceComponent}
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
