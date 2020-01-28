import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../shared/models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  endpoint = 'http://localhost:3000/api/v1';

    constructor(private http: HttpClient) { }

    //Team
    getTeams(): Observable<Team[]> {
      const token = localStorage.getItem('token');

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        })
      }
      return this.http.get<Team[]>(this.endpoint + '/teams', httpOptions);
    }

    addTeam(team : Team): Observable<Team> {
      const token = localStorage.getItem('token');
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        })
      }
      return this.http.post<Team>(this.endpoint + '/teams', team, httpOptions);
    }

    getTeam(id : string): Observable<Team> {
   localStorage.setItem("teamID", id);
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
    console.log("TEAAM ID", localStorage.getItem("teamID"));
      return this.http.get<Team>(this.endpoint + `/teams/`+localStorage.getItem("teamID"), httpOptions);
    }

    deleteTeam(id : string): Observable<any> {
      const token = localStorage.getItem('token');
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'responseType': 'text',
          'Authorization': token
        })
      }
      return this.http.delete(this.endpoint + `/teams/${id}`, httpOptions);
    }

    addMember(idTeam : string): Observable<any> {
      const token = localStorage.getItem('token');
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'responseType': 'text',
          'Authorization': token
        })
      }
      return this.http.delete(this.endpoint + `/teams/${idTeam}/members`, httpOptions);
    }
    deleteMember(idTeam : string, idMember : string): Observable<any> {
      const token = localStorage.getItem('token');
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'responseType': 'text',
          'Authorization': token
        })
      }
      return this.http.delete(this.endpoint + `/teams/${idTeam}/members/${idMember}`, httpOptions);
    }
}
