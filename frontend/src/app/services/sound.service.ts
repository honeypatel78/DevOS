import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

   clickAudio = new Audio();

  constructor() { 
    this.clickAudio.src = 'mouse-click.mp3'; // Make sure the file exists
    this.clickAudio.load();
  }

  //audio
    playSound() {
    this.clickAudio.currentTime = 0; // rewind if already played
    this.clickAudio.play();
    }
}
