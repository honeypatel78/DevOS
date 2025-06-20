import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIResponse } from '../models/interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000';
  
  getUserById(id: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.baseUrl}/user/${id}`);    
  }

  updateUser(userID: number, postData: FormData) {
    return this.http.put(`${this.baseUrl}/update-user/${userID}`, postData);
  }

  updatePassword(userID: number, password: string, newpass: string){
    return this.http.post(`${this.baseUrl}/changePW/${userID}`, {password, newpass});
  }
  }

