import { Component, OnInit } from '@angular/core';
import { version } from "../version";
import { AuthService, User } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  

  constructor(private authService: AuthService) {


    console.log("Vocabulary front end version: " + version.number);
    authService.init();
    
  }

  user: User;

  ngOnInit() {
    this.user = this.authService.user;
  }

  title = 'Vocabulary quiz demo';

  showDemo: boolean = false;

  showDemoFunc() {
    this.showDemo = false;
  }

}


