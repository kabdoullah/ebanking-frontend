import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: boolean = false;
  roles: any;
  username: any;
  accessToken!: any;


  constructor(private http: HttpClient, private router: Router) { }

  public login(username: string, password: string) {
    let options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    let params = new HttpParams().set('username', username).set('password', password);
    return this.http.post('http://localhost:8080/auth/login', params, options);
  }

  loadProfile(data: any) {
    this.isAuthenticated = true;
    this.accessToken = data['access_token'];
    const decoded: any = jwtDecode(this.accessToken);
    this.username = decoded.sub;
    this.roles = decoded.scope;
    window.localStorage.setItem('accessToken', this.accessToken);
  }

  loadToken() {
    let token = window.localStorage.getItem('accessToken');
    if (token) {
      this.loadProfile({ 'access_token': token });
      this.router.navigateByUrl('/admin');

    }
  }

  logout() {
    this.isAuthenticated = false;
    this.accessToken = undefined;
    this.roles = undefined;
    this.username = undefined;
    window.localStorage.removeItem('accessToken');
  }
}
