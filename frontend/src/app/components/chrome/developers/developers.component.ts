import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SoundService } from '../../../services/sound.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/class';
import { APIResponse } from '../../../models/interface';

@Component({
  selector: 'app-developers',
  imports: [CommonModule],
  templateUrl: './developers.component.html',
  styleUrl: './developers.component.scss'
})
export class DevelopersComponent implements OnInit {
  openElement = false;
  users: User[] = [];
  soundService = inject(SoundService);
  userService = inject(UserService);

  ngOnInit(): void {
    this.getallUsers();
  }

  getallUsers() {
    this.userService.getAllUser().subscribe((res: APIResponse) => {
      if (res.status){
      this.users = res.data;
      }
    });
  }

  toggleElement() {
    this.openElement = !this.openElement;
  }

  playsound(){
  this.soundService.playSound();
  }



}
