import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Vocabulary quiz demo';

  showDemo: boolean = false;

  showDemoFunc() {
    this.showDemo = true;
  }
}
