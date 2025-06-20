import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostsService } from '../../../services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { APIResponse } from '../../../models/interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SoundService } from '../../../services/sound.service';

@Component({
  selector: 'app-edit-post',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss'
})
export class EditPostComponent implements OnInit {

  postForm: FormGroup;
  postId: number | null = null;
  selectedImage: File | null = null;
  category: any[] = [];
  submitType: string ='';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private postService: PostsService,
    private router: Router,
    private soundService: SoundService
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      categories: [[], Validators.required],
      postname: ['', Validators.required], 
    });
  }

  ngOnInit(): void {
  this.loadCategories().then(() => {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.postId = idParam ? +idParam : null;

      if (this.postId !== null) {
        this.loadPostData(this.postId);
      } else {
        console.error('Invalid post ID in route');
      }
    });
  }).catch(err => {
    console.error('Error loading categories:', err);
  });
}

playsound(){
  this.soundService.playSound();
}

  // Load categories and return a Promise to ensure sequential loading
  loadCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.postService.getCategories().subscribe({
        next: (res: any) => {
          this.category = res.data;
          resolve();
        },
        error: err => {
          console.error('Failed to load categories:', err);
          reject(err);
        }
      });
    });
  }

  // Load post data for the given ID
  loadPostData(postId: number): void {
    this.postService.getPostById(postId).subscribe({
      next: (res: APIResponse) => {
        if (res.status && res.data) {
          const post = res.data;
          const selectedCategoryIds = post.Categories
            ? post.Categories.split(',').map((name: string) => {
                const match = this.category.find(c => c.CategoryName.trim().toLowerCase() === name.trim().toLowerCase());
                return match ? match.CategoryID : null;
              }).filter((id: number | null) => id !== null)
            : [];

          this.postForm.patchValue({
            title: post.PostTitle,
            description: post.PostDescription,
            categories: selectedCategoryIds,
            postname: post.PostName
          });
        }
      },
      error: err => console.error('Failed to load post data:', err)
    });
  }

  // Capture image input
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  // delete post 
  deletePost() {
  if (!this.postId) return;

  if (confirm('Are you sure you want to delete this post?')) {
    this.postService.addToBinPost(this.postId).subscribe({
      next: () => {
        alert('Post deleted successfully!');
        this.router.navigate(['create']); // Navigate to the desired route after deletion
      },
      error: err => {
        console.error('Delete failed:', err);
        alert('Failed to delete post.');
      }
    });
  }
}


  submitForm(action: string): void {
    if (this.postForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.postForm.value.title);
    formData.append('description', this.postForm.value.description);
    formData.append('categories', JSON.stringify(this.postForm.value.categories));
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    if(action == 'post'){
      formData.append('isPosted','1');
    }
    if(action == 'draft'){
      formData.append('isPosted','0');
    }

    if (this.postId !== null) {
      this.postService.updatePost(this.postId, formData).subscribe({
        next: () => alert('Post updated successfully!'),
        error: err => console.error('Update failed:', err)
      });
    } else {
      console.error('Post ID is missing. Cannot update post.');
    }
  }
}
