import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../services/posts.service';
import { APIResponse } from '../../../models/interface';
import { Posts } from '../../../models/class';
import { SoundService } from '../../../services/sound.service';

@Component({
  selector: 'app-posted-post',
  imports: [CommonModule],
  templateUrl: './posted-post.component.html',
  styleUrl: './posted-post.component.scss'
})
export class PostedPostComponent implements OnInit{

  postService = inject(PostsService);
  userID = Number(sessionStorage.getItem("userID"));
  posts : Posts[] = [];
  isPost = false;
  index = 0;

  constructor(private soundService: SoundService){
  
  }
  
  ngOnInit(): void {
      this.getPostsById();
  }

    playsound(){
    this.soundService.playSound();
  }


  getPostsById(){
    this.postService.getPostByUserId(this.userID).subscribe((res: APIResponse) => {
      this.posts = res.data;
    });
  }

  //Image Conversion
  getBase64Image(buffer: any): string {
  const base64String = btoa(
    new Uint8Array(buffer.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  return `data:image/jpeg;base64,${base64String}`;
  }

  viewPosts(index: number){
    this.index = index;
    this.isPost = true;
    console.log(this.index);
  }

  close(){
    this.isPost = false;
  }

}