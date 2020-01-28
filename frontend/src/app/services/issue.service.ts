import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../shared/models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  endpoint = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) { }

  getIssues(): Observable<Issue[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
    console.log('token', token);
    console.log("httpOptions", httpOptions);
    console.log("userID", localStorage.getItem("userID"));
    return this.http.get<Issue[]>(this.endpoint +`/users/`+ localStorage.getItem("userId")+`/issues`, httpOptions);
  }

  getIssue(idIssue : string): Observable<Issue> {
  const token = localStorage.getItem('token');
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
  }
    return this.http.get<Issue>(this.endpoint +`/issues/${idIssue}`, httpOptions);
  }

  deleteIssue(idIssue : string): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'responseType': 'text',
        'Authorization': token
      })
    }
    return this.http.delete(this.endpoint + `/issues/${idIssue}`, httpOptions);
  }

}
