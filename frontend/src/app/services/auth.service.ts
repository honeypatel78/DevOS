import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthResponse } from "../models/interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  loginUser(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { username, password });
  }

  signupUser(username: string, password: string, avatar: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, { username, password, avatar });
  }

  login(user: any) {
    localStorage.setItem('username', user.username);
    localStorage.setItem('userID', user.id);
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userID');
  }

  getUser() {
    const username = localStorage.getItem('username');
    if (username) {
      return { username};
    }
    return null;
  }
}
