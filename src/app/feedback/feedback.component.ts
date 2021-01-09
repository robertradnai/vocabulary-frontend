import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuizService } from '../quiz-service.service'

@Component({
  selector: 'app-feedback',
  template: `
  <div class="container">
    <h1>
      {{title}}
    </h1>
    <!-- https://www.kiltandcode.com/2020/01/19/using-angular-8-to-create-a-simple-form-with-formbuilder/ -->
    <form *ngIf="isShowForm" [formGroup]="formGroup" (ngSubmit)="onSubmit(formGroup.value)">
      <div class="form-group">
        <label for="name">Name: </label>
        <input type="text" class="form-control" id="name" placeholder="Enter name" formControlName="name" />
      </div>

      <div class="form-group">
        <label for="name">Email address: </label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" formControlName="email" />
      </div>

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="subscribe" formControlName="subscribe" />
        <label class="form-check-label" for="subscribe">Subscribe to occasional emails about the state of development.</label>
      </div>

      <p>Use the fields below if you'd like to contact the developer.</p>

      <div class="form-group">
        <label for="subject">Subject: </label>
        <input type="text" class="form-control" id="subject" placeholder="Subject of the message" formControlName="subject" />
      </div>

      <div class="form-group">
        <label for="message">Message text: </label>
        <textarea class="form-control" id="message" placeholder="Message text" formControlName="message" ></textarea>
      </div>

      <button class="btn btn-primary" type="submit">Submit</button>
    </form>
    <p>{{submissionMessage}}</p>
  </div>

  `,
  styles: [
  ]
})
export class FeedbackComponent implements OnInit {

  title = 'Subscribe to newsletter or send feedback';
  formGroup: FormGroup;

  // UI
  submissionMessage: String = "";
  isShowForm: boolean = true;

  constructor(private formBuilder: FormBuilder,
    private quizService: QuizService) {

    this.formGroup = this.formBuilder.group({
      name: '',
      email: '',
      subscribe: true,
      subject: '',
      message: ''
    });
  }

  onSubmit(formGroup: FormGroup) {
    var formData: FormData = new FormData();

    formData.append("name", formGroup["name"]);
    formData.append("email", formGroup["email"]);
    formData.append("is_subscribe", formGroup["subscribe"]);
    formData.append("subject", formGroup["subject"]);
    formData.append("message", formGroup["message"]);

    this.quizService.submitFeedback(formData).subscribe(
      res => {
        this.submissionMessage = "Form submission was successful, thank you for your interest!"
        this.isShowForm = false;
      }, err => {
        this.submissionMessage = "Form submission was not successful. "
          + "Please check if your email address is correct and the name field is not empty. "
          + "The backend server may also be down."
      }
    );
  }

  ngOnInit() {
    
  }

}
