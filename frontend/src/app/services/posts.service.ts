import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/interface';

interface LikeCountResponse {
  status: boolean;
  likeCount: number;
}

interface LikeCheckResponse {
  status: boolean;
  liked: boolean;
}

interface ApiResponse {
  status: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000';

  //*********************** Post Services ************************/

  //GET ALL POSTS
  getPosts(): Observable<APIResponse>{
    return this.http.get<APIResponse>(`${this.baseUrl}/posts`);
  }

  //01. GET POST BY POST ID
  getPostById(id: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.baseUrl}/post/${id}`);
  }
  //02. GET POSTS BY USER ID
  getPostByUserId(id: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.baseUrl}/posts/${id}`);
  }
  //03. GET DRAFTS BY USER ID
  getDraftByUserId(id: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.baseUrl}/drafts/${id}`);
  }


  // ADD POST
  addPost(postData: FormData){
    return this.http.post(`${this.baseUrl}/upload-post`, postData);
  }


  // UPDATE POST
  updatePost(id: number, postData: FormData) {
    return this.http.put(`${this.baseUrl}/update-post/${id}`, postData);
  }
  

  //DELETE POST
  deletePost(id: number){
    return this.http.delete(`${this.baseUrl}/delete-post/${id}`);
  }

  addToBinPost(id: number){
    return this.http.post(`${this.baseUrl}/bin`, {id});
  }

  getDeletedPost(id:number): Observable<APIResponse>{
    return this.http.get<APIResponse>(`${this.baseUrl}/deleted-posts/${id}`);
  }

  restorePost(id: number){
    return this.http.post(`${this.baseUrl}/restore`, {id});
  }

  //*********************** Categories Services ************************/

   getCategories(): Observable<APIResponse> {
  return this.http.get<APIResponse>(`${this.baseUrl}/categories`);
  }

  //*********************** Like Services *****************************/

  likePost(postId: number, userId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/like/like`, { postId, userId });
  }

  unlikePost(postId: number, userId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/like/unlike`, { postId, userId });
  }

  getLikeCount(postId: number): Observable<LikeCountResponse> {
    return this.http.get<LikeCountResponse>(`${this.baseUrl}/like/count/${postId}`);
  }

  checkIfLiked(postId: number, userId: number): Observable<LikeCheckResponse> {
    return this.http.get<LikeCheckResponse>(`${this.baseUrl}/like/check`, {
      params: { postId: postId.toString(), userId: userId.toString() }
    });
  }

  //*********************** Comments Services ************************/

  getComments(postId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.baseUrl}/comment/comments/${postId}`);
  }

  addComment(postId: number, userId: number, commentText: string, username: string): Observable<APIResponse> {
    const body = { postId, userId, commentText, username };
    return this.http.post<APIResponse>(`${this.baseUrl}/comment/comments`, body);
  }
  
}
