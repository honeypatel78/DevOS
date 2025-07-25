import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';
import { SoundService } from '../../../services/sound.service';

@Component({
  selector: 'app-display',
  imports: [ MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './display.component.html', 
  styleUrl: './display.component.scss'
})
export class DisplayComponent implements OnInit {

  soundService = inject(SoundService);

  ngOnInit() {
  const savedTheme = sessionStorage.getItem('theme') || 'default';
  const savedMode = sessionStorage.getItem('mode') || 'light';

  this.setTheme(savedTheme);
  this.setMode(savedMode);
  }

  playsound() {
    this.soundService.playSound();
  }

  setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
   sessionStorage.setItem('theme', theme);
    
  }

  setMode(mode: string) {
    document.documentElement.setAttribute('data-mode', mode);
    sessionStorage.setItem('mode', mode);
  }
}
