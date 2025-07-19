import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../../services/posts.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SoundService } from '../../../services/sound.service';
import { APIResponse } from '../../../models/interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FilterService } from '../../../services/filter.service';

@Component({
  selector: 'app-post-section',
  imports: [CommonModule, FormsModule],
  templateUrl: './post-section.component.html',
  styleUrl: './post-section.component.scss'
})
export class PostSectionComponent implements OnInit, OnDestroy {

   postService = inject(PostsService);
   posts: any[] = [];
  
   //Filter
   categories: any[] = [];        
   showFilter: boolean = false;  

   selectedCategory: string = ''; 
   filteredPosts: any[] = []; 

   appliedFilter = false;
  
   //like
   likesCount: { [key: number]: number } = {};
   likedPosts: Set<number> = new Set();

   //comment 
   comments: { [postId: number]: any[] } = {};
   isCommentBox: { [key: number]: boolean } = {};
   newComments: { [key: number]: string } = {};

   //login
    username = '';
    password = '';
    showLoginForm = false;

    loginError = '';
    loginMessage ='';

    showSignupForm = false;
    showAvatar = false;

    private sub: Subscription | undefined;

    constructor(public auth: AuthService, private http: HttpClient, private router: Router, private soundService: SoundService, private filterService: FilterService) {
    }
  
    ngOnInit(): void {
        this.getPosts();
        this.getCategories();
        this.sub = this.filterService.filterClicked$.subscribe(() => {
         this.toggleFilter();
    });
    }

    //audios
    playsound(){
       this.soundService.playSound();
    }

    // Post
    getPosts(){
    this.postService.getPosts().subscribe((res:APIResponse) => {
      this.posts = res.data;
      // console.log(this.posts);
       this.posts.forEach(post => this.loadLikes(post.PostID)); // Load likes once per post
       this.posts.forEach(post => this.getComments(post.PostID));// Load comments once per post
    });
    }

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


   //Filter
    toggleFilter() {
      this.soundService.playSound();
      if (!this.showFilter) {
        this.getCategories();
      }
      this.showFilter = !this.showFilter;
    }

    applyFilter(){
      if (!this.selectedCategory) {
        // If no category selected, show all posts
        this.filteredPosts = [...this.posts];
      } else {
        // Filter posts where Categories include selectedCategory
        this.filteredPosts = this.posts.filter(post =>
          post.Categories.split(', ').includes(this.selectedCategory)
        );
      }
      this.showFilter = false;  
      this.appliedFilter = true;
    }

    removeFilter(){
      this.filteredPosts = [...this.posts];
      this.selectedCategory = ''; 
      this.appliedFilter = false;
    }

    //Login
    toggleLoginForm() {
      this.showLoginForm = !this.showLoginForm;
      this.loginMessage = '';
      if (this.showLoginForm) {
          document.body.classList.add('modal-open');
        } else {
          document.body.classList.remove('modal-open');
        }
    }

    login() {
    this.http.post<any>('http://localhost:3000/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.status) {
          this.auth.login(res.user); // Store user data locally
          this.loginMessage = 'Login successful';
          this.showLoginForm = false;

          if (res.user.role === 'admin') {
            this.router.navigate(['/post-editor']);
          } else {
            this.router.navigate(['/profile']);
          }
        } else {
          this.loginMessage = 'Invalid username or password';
        }
      },
      error: (err) => {
        this.loginMessage = err.error.message || 'Login failed';
      }
    });

      this.showLoginForm = false;
      document.body.classList.remove('modal-open');
    }

    
    logout() {
      this.auth.logout();
      this.loginMessage = '';
      this.router.navigate(['/']);
    }


    //Sign up
    toggleSignupForm() {
      this.showSignupForm = !this.showSignupForm;
      this.loginMessage = '';
      if (this.showLoginForm) {
          document.body.classList.add('modal-open');
        } else {
          document.body.classList.remove('modal-open');
        }
    }

    ngOnDestroy(): void {
  if (this.sub) {
    this.sub.unsubscribe();
  }
}


}
