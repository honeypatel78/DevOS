import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskbarComponent } from '../taskbar/taskbar.component';

@Component({
  selector: 'app-desktop',
  imports: [RouterOutlet, TaskbarComponent],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.scss'
})
export class DesktopComponent {
}
