import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-taskbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './taskbar.component.html',
  styleUrl: './taskbar.component.scss'
})
export class TaskbarComponent implements OnInit, OnDestroy {

  btnclick = false;

  date = new Date();

   private intervalId!: number;
   soundService = inject(SoundService);

  ngOnInit() {
    this.intervalId = window.setInterval(() => {
      this.date = new Date();
    }, 30000);
  }

  playsound(){
    this.soundService.playSound();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
    
  buttonToggle(){
    this.btnclick = !this.btnclick;
  }
}
