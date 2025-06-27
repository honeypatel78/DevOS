import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-help-section',
  imports: [RouterLink],
  templateUrl: './help-section.component.html',
  styleUrl: './help-section.component.scss'
})
export class HelpSectionComponent {

  constructor(private soundService: SoundService) {}

  playsound() {
    this.soundService.playSound();
  }

}
