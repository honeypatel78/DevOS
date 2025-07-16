import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthResponse } from "../models/interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   // private baseUrl = 'http://localhost:3000';
  private baseUrl = 'http://192.168.1.119:3000';

  constructor(private http: HttpClient) {}

  loginUser(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { username, password });
  }

  signupUser(username: string, password: string, avatar: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, { username, password, avatar });
  }

  login(user: any) {
    sessionStorage.setItem('username', user.username);
  sessionStorage.setItem('userID', user.id);
  }

  logout() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userID');
  }

  getUser() {
    const username = sessionStorage.getItem('username');
    if (username) {
      return { username};
    }
    return null;
  }
}
