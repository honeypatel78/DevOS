import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../services/posts.service';
import { Posts } from '../../../models/class';
import { APIResponse } from '../../../models/interface';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  isPostHeader = false;
  isDraftHeader= false;
  postService = inject(PostsService);
  posts: Posts[] = [];
  drafts: Posts[] = [];

  userID = Number(sessionStorage.getItem('userID'));

  ngOnInit() {
    this.postService.getPostByUserId(this.userID).subscribe((res:APIResponse) => {
        this.posts = res.data;
            });

      this.postService.getDraftByUserId(this.userID).subscribe((res:APIResponse) => {
        this.drafts = res.data;
      });

    }

  openHeader(value: string){
    if(value == 'posts'){
      this.isPostHeader = !this.isPostHeader;
    }
    if(value == 'drafts'){
      this.isDraftHeader = !this.isDraftHeader;
    }
  }

}
