import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  register1(name: string, pwd1: string, pwd2: string): Observable<any> {
    let info = {
      name: name,
      pwd1: pwd1,
      pwd2: pwd2
    };
    return this.http.post<any>(this.apiUrl, info);
  }

  login(name: string, password: string): Observable<{ userId: number; isAdmin: boolean }> {
    let info = {
      name: name,
      password: password
    };
    return this.http.post<{ userId: number; isAdmin: boolean }>(`${this.apiUrl}/login`, info);
  }

  getProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/${userId}`);
  }

  updateProfile(userId: number, realName: string, email: string, phone: string): Observable<any> {
    let info = {
      realName: realName,
      email: email,
      phone: phone
    };
    return this.http.put<any>(`${this.apiUrl}/profile/${userId}`, info);
  }
}