import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostsService } from '../../../services/posts.service';
import { HttpClientModule } from '@angular/common/http';
import { APIResponse } from '../../../models/interface';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SoundService } from '../../../services/sound.service';

@Component({
  selector: 'app-create-post',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})

export class CreatePostComponent {

postForm: FormGroup;
isBtnClicked = false;
selectedImage: File | null = null;
category : any[] = [] ;
postName : string ='';
submitType: string = '';

userID = localStorage.getItem('userID');

constructor(private fb: FormBuilder, private postService: PostsService, private soundService: SoundService) {
  this.postForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    postname: ['', Validators.required],
    categories: [[], Validators.required]
  });
}


  ngOnInit() {
    this.postForm.reset();
    this.getCategories();
  }

  playsound(){
    this.soundService.playSound();
  }

  createPost() {
    this.isBtnClicked = true;
  }


  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }
  
  submitPost(action: string): void {
    if (this.postForm.invalid || !this.selectedImage) {
      console.log(this.postForm);
      console.log('Form is invalid or image not selected');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.postForm.value.title);
    formData.append('postname', this.postForm.value.postname);
    formData.append('description', this.postForm.value.description);
    formData.append('categories', JSON.stringify(this.postForm.value.categories));
    formData.append('image', this.selectedImage);
    formData.append('userID', this.userID ?? '');
    if(action === 'post'){
      formData.append('isPosted', '1');
    }
    if(action === 'draft'){
      formData.append('isPosted', '0');
    }

    this.postService.addPost(formData).subscribe({
      next: (res) => {
        console.log('Post Successful:', res);
        this.isBtnClicked = false;
        this.postForm.reset();
      },
      error: (err) => {
        console.error('Error uploading:', err);
      }
    });
}

getCategories(){
    this.postService.getCategories().subscribe((res: APIResponse) => {
    if (res.status) {
      this.category = res.data;
    } else {
      console.error('Failed to fetch categories:', res.message);
    }
  }, error => {
    console.error('API error:', error);
  });
  }

}
