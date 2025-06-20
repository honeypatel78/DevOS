import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

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
