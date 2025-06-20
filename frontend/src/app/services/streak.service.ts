import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class StreakService {

  constructor(private http: HttpClient) { }

  getPostedAt(id: number): Observable<APIResponse>{
    return this.http.get<APIResponse>(`http://localhost:3000/streak/${id}`);
  }
}
