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
  selector: 'app-settings',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})

export class SettingsComponent {

  postService = inject(PostsService);
  userService = inject(UserService);

  constructor(public auth: AuthService, private http: HttpClient, private router: Router, private soundService: SoundService) {}
 


  playsound() {
    this.soundService.playSound();
  }

  
   
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }







}
