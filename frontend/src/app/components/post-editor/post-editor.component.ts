import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-post-editor',
  imports: [RouterOutlet, SidebarComponent, RouterLink, RouterLinkActive],
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.scss'
})
export class PostEditorComponent {

  constructor(private soundService: SoundService){
  }

  playsound(){
     this.soundService.playSound();
  }

}
