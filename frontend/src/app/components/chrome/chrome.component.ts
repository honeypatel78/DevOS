import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { APIResponse } from '../../models/interface';
import { Posts } from '../../models/class';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SoundService } from '../../services/sound.service';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-chrome',
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './chrome.component.html',
  styleUrl: './chrome.component.scss'
})

export class ChromeComponent{


   soundService = inject(SoundService);
   filterService = inject(FilterService);

    //audio
    playsound(){
       this.soundService.playSound();
    }

    applyFilter() {
    this.filterService.triggerFilter();
    }

   
}

