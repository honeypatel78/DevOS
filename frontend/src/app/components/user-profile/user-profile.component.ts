import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { APIResponse } from '../../models/interface';
import { CommonModule } from '@angular/common';
import { Posts } from '../../models/class';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { SoundService } from '../../services/sound.service';



@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit{

  postService = inject(PostsService);
  userService = inject(UserService);

  constructor(public auth: AuthService, private http: HttpClient, private router: Router, private soundService: SoundService) {}
 

  ngOnInit() {
     this.getUser();
  }

  playsound() {
    this.soundService.playSound();
  }

   userID = localStorage.getItem('userID');
   userName = localStorage.getItem('username');

    user = {
      UserID: 0,
      Username: '',
      Password: '',
      ProfilePhoto: '',
      CreatedAt: '',
      UserRole: ''
    }

  

   getUser(){
    const id = this.userID !== null ? Number(this.userID) : null;
    if (id !== null && !isNaN(id)) {
      this.userService.getUserById(id).subscribe((res:APIResponse) => {
        this.user = res.data;
      });
    } else {
      console.error('Invalid userID:', this.userID);
    }
   }

   
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }







}
