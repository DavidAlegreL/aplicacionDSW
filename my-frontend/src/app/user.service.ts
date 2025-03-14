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

  login(name: string, password: string): Observable<any> {
    let info = {
      name: name,
      password: password
    };
    return this.http.post<any>(`${this.apiUrl}/login`, info);
  }

  getUsers1(name: string, pwd: string): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}