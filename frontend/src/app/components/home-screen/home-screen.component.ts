import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StreakService } from '../../services/streak.service';
import { APIResponse } from '../../models/interface';
import { SoundService } from '../../services/sound.service';
import { FormsModule } from '@angular/forms';
import { TerminalComponent } from '../terminal/terminal.component';

@Component({
  selector: 'app-home-screen',
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule, TerminalComponent],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss'
})
export class HomeScreenComponent implements OnInit{

  year: number;
  month: number;
  monthName: string;
  days: (number | null)[] = [];
  isCalender = false;
  postedDates: string[] = [];
  maxStreak = 1;
  currentStreak = 1;

  isTerminal = false;

  streakService = inject(StreakService);
  soundService = inject(SoundService);


  id = Number(sessionStorage.getItem('userID'));

  constructor() { 
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth(); // 0-based
    this.monthName = new Date(this.year, this.month).toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    this.generateCalendar(this.year, this.month);
    this.getPostedAt(this.id);
  }

  toggleTerminal() {
    this.isTerminal = !this.isTerminal;
  }

  playsound(){
    this.soundService.playSound();
  }

  getPostedAt(id: number) {
  this.streakService.getPostedAt(id).subscribe(response => {
    const postedDateStrs: string[] = response.data.map((item: any) =>
      new Date(item.CreatedAt).toISOString().split('T')[0]
    );

    // Convert to Date objects and sort
    const postedDates = postedDateStrs
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());

    

    for (let i = 1; i < postedDates.length; i++) {
      const diffInMs = postedDates[i].getTime() - postedDates[i - 1].getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays === 1) {
        this.currentStreak++;
        this.maxStreak = Math.max(this.maxStreak, this.currentStreak);
      } else if (diffInDays > 1) {
        this.currentStreak = 1;
      }
    }

    console.log('Max streak:', this.maxStreak);
    this.postedDates = postedDateStrs; // Keep this for calendar highlight
  });
}


  generateCalendar(year: number, month: number) {
    this.days = [];

    // First day index (0=Sun, 1=Mon ...)
    const firstDayIndex = new Date(year, month, 1).getDay();

    // Number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill initial blanks
    for(let i = 0; i < firstDayIndex; i++) {
      this.days.push(null);
    }

    // Fill days numbers
    for(let day = 1; day <= daysInMonth; day++) {
      this.days.push(day);
    }
  }

  isPostedDate(day: number | null): boolean {
    if (day === null) return false;

    const dateStr = `${this.year}-${String(this.month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return this.postedDates.includes(dateStr);
  }

  toggleCalender(){
    this.isCalender = !this.isCalender;
  }

}
