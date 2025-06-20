import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-display',
  imports: [ MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './display.component.html', 
  styleUrl: './display.component.scss'
})
export class DisplayComponent implements OnInit {

  ngOnInit() {
  const savedTheme = localStorage.getItem('theme') || 'default';
  const savedMode = localStorage.getItem('mode') || 'light';

  this.setTheme(savedTheme);
  this.setMode(savedMode);
 }

  
   setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
  }

  setMode(mode: string) {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('mode', mode);
  }
}
