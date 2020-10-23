import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service'
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form:FormGroup;

  constructor(private fb:FormBuilder, 
    private authService: AuthService,
    private router: Router) {

      this.form = this.fb.group({
        email: ['',Validators.required],
        password: ['',Validators.required]
    });
     }

  ngOnInit(): void {
  }

  login() {
    const val = this.form.value;

    if (val.email && val.password) {
        this.authService.login(val.email, val.password)
            .subscribe((res: Object) => {
                console.log("Got response from login: "+JSON.stringify(res));
                var auth_token: String = (res as any).response.user.authentication_token;
                // this.setSession;
                console.log("Extracted token: "+ auth_token);
                this.router.navigateByUrl('/');
              }
            );
    }
}

}
