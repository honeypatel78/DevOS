import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SoundService } from '../../services/sound.service';

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
  showSignupForm = false;

  soundService = inject(SoundService);
  constructor(public auth: AuthService, private http: HttpClient, private router: Router) {}

  //Login 

  login() {
  this.auth.loginUser(this.username, this.password).subscribe({
    next: (res) => {
      if (res.status) {
        this.auth.login(res.user); 
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
    document.body.classList.remove('modal-open');
 }

  //Sign Up 

  signup() {
    if(this.password != this.confirmPassword){
      this.loginMessage = 'Password do not match';
      return;
    }
    if(!this.avatar){
      this.loginMessage = 'Please select an avatar';
      return;
    }
    this.auth.signupUser(this.username, this.password, this.avatar).subscribe({
    next: (res) => {
        if (res.status) {
          this.auth.login(res.user); 
          this.loginMessage = 'Signup successful';
          this.router.navigate(['desktop']);
        } else {
          this.loginMessage = 'Signup failed';
        }
      },
      error: (err) => {
        this.loginMessage = err.error.message || 'Signup failed';
      }
    });
  }

  toggleSignupForm() {
    this.showSignupForm = !this.showSignupForm;
    this.loginMessage = '';
  }

  playsound(){
      this.soundService.playSound();
  }
 }
