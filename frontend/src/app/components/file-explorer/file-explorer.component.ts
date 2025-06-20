import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-file-explorer',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './file-explorer.component.html',
  styleUrl: './file-explorer.component.scss'
})
export class FileExplorerComponent {

  constructor(private soundService: SoundService){

  }

  playsound(){
  this.soundService.playSound();
}

  

}
