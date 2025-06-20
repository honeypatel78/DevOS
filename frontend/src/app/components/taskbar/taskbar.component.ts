import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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

  ngOnInit() {
    this.intervalId = window.setInterval(() => {
      this.date = new Date();
    }, 30000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
    
  buttonToggle(){
    this.btnclick = !this.btnclick;
  }
}
