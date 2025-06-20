import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../services/posts.service';
import { APIResponse } from '../../../models/interface';
import { CommonModule } from '@angular/common';
import { Posts } from '../../../models/class';
import { SoundService } from '../../../services/sound.service';

@Component({
  selector: 'app-drafts',
  imports: [CommonModule],
  templateUrl: './drafts.component.html',
  styleUrl: './drafts.component.scss'
})
export class DraftsComponent implements OnInit{

  postService = inject(PostsService);
  userID = Number(localStorage.getItem("userID"));
  drafts : Posts[] = [];
  index = 0;
  isDraft = false;

  constructor(private soundService: SoundService){

  }

  ngOnInit(): void {
      this.getDraftsById();
  }

    playsound(){
    this.soundService.playSound();
  }


  getDraftsById(){
    this.postService.getDraftByUserId(this.userID).subscribe((res: APIResponse) => {
      this.drafts = res.data;
    });
  }

   //Image Conversion
  getBase64Image(buffer: any): string {
  const base64String = btoa(
    new Uint8Array(buffer.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  return `data:image/jpeg;base64,${base64String}`;
  }

  viewDrafts(index: number){
    this.index = index;
    this.isDraft = true;
    console.log(this.index);
  }

  close(){
    this.isDraft = false;
  }

}
