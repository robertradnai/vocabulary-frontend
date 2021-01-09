import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  template: `
  <div class="container">
    <h1>
      {{title}}
    </h1>
    <!-- https://www.kiltandcode.com/2020/01/19/using-angular-8-to-create-a-simple-form-with-formbuilder/ -->
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit(formGroup.value)">
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
  </div>

  `,
  styles: [
  ]
})
export class FeedbackComponent implements OnInit {

  title = 'Subscribe to newsletter or send feedback';
  formGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      name: '',
      email: '',
      subscribe: true,
      subject: '',
      message: ''
    });
  }

  onSubmit(formData) {
    var name = formData['name'];
  }

  ngOnInit() {
    
  }

}
