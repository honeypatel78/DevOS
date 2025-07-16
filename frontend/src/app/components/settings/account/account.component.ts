import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostsService } from '../../../services/posts.service';
import { APIResponse } from '../../../models/interface';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { SoundService } from '../../../services/sound.service';
import { User } from '../../../models/class';


@Component({
  selector: 'app-account',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {

  userService = inject(UserService);
  editEnabled = false;
  showPasswordChange = false;
  password = '';
  newpass = '';
  loginMessage = '';
  selectedImage: File | null = null;
  postForm: FormGroup;

  userID = Number(sessionStorage.getItem('userID'));
  userName = sessionStorage.getItem('username');
 

  ngOnInit() {
     this.getUser();
  }

  constructor(
    private fb: FormBuilder,
    private soundService: SoundService
  ) {
    this.postForm = this.fb.group({
      name: ['', Validators.required],
      bio: ['', Validators.required],
      username: ['', Validators.required]
    });
  }

    user: User =  new User();

   getUser(){
    const id = this.userID !== null ? Number(this.userID) : null;
    if (id !== null && !isNaN(id)) {
      this.userService.getUserById(id).subscribe((res:APIResponse) => {
        this.user = res.data;
      });
    } else {
      console.error('Invalid userID:', this.userID);
    }
   }

   playsound(){
    this.soundService.playSound(); 
   }

   toggleEdit() {
    this.editEnabled = !this.editEnabled;
   }

   onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

   submitForm(): void {
    if (this.postForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.postForm.value.name);
    formData.append('username', this.postForm.value.username);
    formData.append('bio', this.postForm.value.bio);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    if (this.userID !== null) {
      this.userService.updateUser(this.userID, formData).subscribe({
        next: () => alert('Post updated successfully!'),
        error: err => console.error('Update failed:', err)
      });
    } else {
      console.error('Post ID is missing. Cannot update post.');
    }
  }

  togglePW(){
    this.showPasswordChange = !this.showPasswordChange;
  }
  changePassword() {
  this.userService.updatePassword(this.userID, this.password, this.newpass)
    .subscribe({
      next: (res:any) => {
        this.loginMessage = res.message;
      },
      error: (err) => {
        this.loginMessage = err.error?.message || 'Error updating password';
      }
    });
}


}
