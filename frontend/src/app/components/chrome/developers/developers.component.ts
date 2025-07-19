import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SoundService } from '../../../services/sound.service';
import { UserService } from '../../../services/user.service';
import { Posts, User } from '../../../models/class';
import { APIResponse } from '../../../models/interface';
import { PostsService } from '../../../services/posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FilterService } from '../../../services/filter.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-developers',
  imports: [CommonModule, FormsModule],
  templateUrl: './developers.component.html',
  styleUrl: './developers.component.scss'
})
export class DevelopersComponent implements OnInit {
    openElement = false;
    openPost = false;

    posts: Posts[] = [];
    users: User[] = [];
    categories: any[] = []; 
    
    soundService = inject(SoundService);
    userService = inject(UserService);
    postService = inject(PostsService);

  
   //like
   likesCount: { [key: number]: number } = {};
   likedPosts: Set<number> = new Set();

   //comment 
   comments: { [postId: number]: any[] } = {};
   isCommentBox: { [key: number]: boolean } = {};
   newComments: { [key: number]: string } = {};

   private sub: Subscription | undefined;

  constructor(public auth: AuthService, private http: HttpClient, private router: Router, private filterService: FilterService) {
  }


  ngOnInit(): void {
    this.getallUsers();
    this.getCategories();
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

  togglePost() {
    this.openPost = true;
  }

  showPost(PostID : number){
    console.log('PostID:', PostID);
    this.postService.getPostById(PostID).subscribe((res: APIResponse) =>{
      if (res.status) {
        this.posts = [res.data]; 
        console.log('Post fetched:', this.posts);
        this.loadLikes(PostID); // Load likes for the specific post
        this.getComments(PostID); // Load comments for the specific post
      } else {
        console.error('Failed to fetch post:', res.message);
      }
    })
  }

  // Post
   

    //Image Conversion
    getBase64Image(buffer: any): string {
    const base64String = btoa(
      new Uint8Array(buffer.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/jpeg;base64,${base64String}`;
}

    // Categories
    getCategories(){
    this.postService.getCategories().subscribe((res: APIResponse) => {
    if (res.status) {
      this.categories = res.data;
      console.log('Categories fetched:', this.categories);
    } else {
      console.error('Failed to fetch categories:', res.message);
      console.log('No categories available');
    }
    }, error => {
    console.error('API error:', error);
    });
   }

    //Like post
      getCurrentUserId(): number | null {
        const userId = sessionStorage.getItem('userID');
        return userId ? +userId : null;
      }

      loadLikes(postId: number) {
      const userId = this.getCurrentUserId();

      // Get like count for a specific post
      this.postService.getLikeCount(postId).subscribe(res => {
        if (res.status) this.likesCount[postId] = res.likeCount;
      });

      // Check if current user liked the post
      if (userId) {
        this.postService.checkIfLiked(postId, userId).subscribe(res => {
          if (res.status && res.liked) this.likedPosts.add(postId);
        });
      }
    }

      isLiked(postId: number): boolean {
        return this.likedPosts.has(postId);
      }

      toggleLike(postId: number) {
         this.soundService.playSound();
        const userId = this.getCurrentUserId();
        if (!userId) {
          alert('Please log in to like posts');
          return;
        }

        if (this.isLiked(postId)) {
          this.postService.unlikePost(postId, userId).subscribe({
            next: () => {
              this.likedPosts.delete(postId);
              this.likesCount[postId] = (this.likesCount[postId] || 1) - 1;
            },
            error: err => console.error('Error unliking post', err)
          });
        } else {
          this.postService.likePost(postId, userId).subscribe({
            next: () => {
              this.likedPosts.add(postId);
              this.likesCount[postId] = (this.likesCount[postId] || 0) + 1;
            },
            error: err => console.error('Error liking post', err)
          });
        }
      }

  // Comment
      toggleCommentBox(postId: number): void {
          this.soundService.playSound();
          this.isCommentBox[postId] = !this.isCommentBox[postId];
      }

      submitComment(postId: number): void {
      const commentText = this.newComments[postId]?.trim();
      const userId = this.getCurrentUserId();
      const userName = sessionStorage.getItem('username') ?? 'Anonymous';

      if (!userId) {
        alert('Please log in to comment.');
        return;
      }

      if (!commentText) {
        alert('Comment cannot be empty.');
        return;
      }

      this.postService.addComment(postId, userId, commentText, userName).subscribe({
        next: (res) => {
          if (res.status) {
            alert('Comment added successfully.');
            this.newComments[postId] = ''; // Clear input
          } else {
            alert('Failed to add comment.');
          }
        },
        error: (err) => {
          console.error('Error posting comment', err);
          alert('Server error while posting comment.');
        }
      });
    }

    getComments(postId: number): void {
      this.postService.getComments(postId).subscribe({
        next: (res) => {
          if (res.status) {
            this.comments[postId] = res.data;
          } else {
            this.comments[postId] = []; // default to empty
          }
        },
        error: err => {
          console.error(`Failed to fetch comments for post ${postId}`, err);
          this.comments[postId] = []; // on error, fallback
        }
      });
    }





}
