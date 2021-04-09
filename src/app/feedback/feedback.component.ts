import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuizService } from '../quiz-service.service'

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  title = 'Contact and newsletter';
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
