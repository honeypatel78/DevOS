import { Component, inject, OnInit } from '@angular/core';
import { APIResponse } from '../../models/interface';
import { PostsService } from '../../services/posts.service';
import { Posts } from '../../models/class';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-recycle-bin',
  imports: [CommonModule, RouterLink],
  templateUrl: './recycle-bin.component.html',
  styleUrl: './recycle-bin.component.scss'
})
export class RecycleBinComponent implements OnInit{
  
  postService = inject(PostsService);
  soundService = inject(SoundService);
  userID = Number(localStorage.getItem("userID"));
  deletes : Posts[] = [];
  index = 0;
  isDraft = false;

  ngOnInit(): void {
      this.getDraftsById();
  }

  playsound(){
    this.soundService.playSound();
  }

  getDraftsById(){
    this.postService.getDeletedPost(this.userID).subscribe((res: APIResponse) => {
      this.deletes = res.data;
    });
  }

  viewDrafts(index: number){
    this.index = index;
    this.isDraft = true;
    console.log(this.index);
  }

  getBase64Image(buffer: any): string {
    const base64String = btoa(
      new Uint8Array(buffer.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/jpeg;base64,${base64String}`;
}

  // Restore

  Restore(postID: number){
    this.postService.restorePost(postID).subscribe({
       next: (res) => {
        alert('Post Restored Successfully');
      },
      error: (err) => {
        console.error('Error uploading:', err);
      }
    })
    this.isDraft = false;
    this.getDraftsById();
  }

  Delete(postId: number) {
  if (!postId) return;

  if (confirm('Are you sure you want to delete this post?')) {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        alert('Post deleted successfully!');
        // this.router.navigate(['create']); // Navigate to the desired route after deletion
      },
      error: err => {
        console.error('Delete failed:', err);
        alert('Failed to delete post.');
      }
    });
    this.isDraft = false;
    this.getDraftsById();
  }


}
}
