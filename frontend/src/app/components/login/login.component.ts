import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username = '';
  password = '';
  confirmPassword = '';
  avatar = '';
  loginMessage ='';
  showAvatar = true;
  showSignupForm = false;
  constructor(public auth: AuthService, private http: HttpClient, private router: Router) {}

  login() {
  this.http.post<any>('http://localhost:3000/login', {
    username: this.username,
    password: this.password
  }).subscribe({
    next: (res) => {
      if (res.status) {
        this.auth.login(res.user); // Store user data locally
        this.loginMessage = 'Login successful';

        if (res.user.role === 'user') {
          this.router.navigate(['desktop']);
        } else {
          this.router.navigate(['desktop']);
        }
      } else {
        this.loginMessage = 'Invalid username or password';
      }
    },
    error: (err) => {
      this.loginMessage = err.error.message || 'Login failed';
    }
  });
    document.body.classList.remove('modal-open');
}

// Sign Up 

signup() {
  if(this.password != this.confirmPassword){
    this.loginMessage = 'Password do not match';
    return;
  }
  this.http.post<any>('http://localhost:3000/signup', {
  username: this.username,
  password: this.password,
  avatar: this.avatar  // e.g., "avatar1"
}
  ).subscribe({
    next: (res) => {
      if (res.status) {
        this.auth.login(res.user); // Store user data locally
        this.loginMessage = 'Login successful';
        
          this.router.navigate(['desktop']);
      
        
      } else {
        this.loginMessage = 'Invalid username or password';
      }
    },
    error: (err) => {
      this.loginMessage = err.error.message || 'Login failed';
    }
  });
    
}

toggleSignupForm() {
  this.showSignupForm = !this.showSignupForm;
  this.loginMessage = '';
  }

toggleAvatar(){
  this.showAvatar = !this.showAvatar;
}  


signupfake(){
  console.log(this.avatar);
}
}
