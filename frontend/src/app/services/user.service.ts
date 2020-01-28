import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

endpoint = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) { }
//Users
  login(credentials): Observable<any> {
    return this.http.post(this.endpoint + '/users/login', credentials);
  }
  logout(user: User): Observable<User> {
    return this.http.post(this.endpoint + '/users/'+localStorage.getItem("userId")+'/logout', user);
  }
  register(user: User): Observable<User> {
    return this.http.post<User>(this.endpoint + '/users/register', user);
  }
  getUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
    return this.http.get<User[]>(this.endpoint + '/users', httpOptions);
  }
  // countUsers(): Observable<number> {
  //   return this.http.get<number>(this.endpoint+'/users/count');
  // }
  // addUser(user: User): Observable<User> {
  //   return this.http.post<User>(this.endpoint+'/user', user);
  // }
  getUser(user: User): Observable<User> {
  const token = localStorage.getItem('token');
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
  }
    return this.http.get<User>(this.endpoint + `/users/`+localStorage.getItem("userId"), httpOptions);
  }
  editUser(user: User): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'responseType': 'text',
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
    console.log("get user");
    console.log("token", localStorage.getItem('token'));
    console.log("userID", localStorage.getItem("userId"));
    console.log("name", localStorage.getItem("name"));
    console.log("headers",httpOptions);
    console.log("email", localStorage.getItem("email"));
    return this.http.patch(this.endpoint + `/users/`+localStorage.getItem("userId"), user, httpOptions);
  }
  deleteUser(user: User): Observable<any> {
    return this.http.delete(this.endpoint + `/users/`+localStorage.getItem("userId"), { responseType: 'text' });
  }
}
