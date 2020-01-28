import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../shared/models/category.model';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  endpoint = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) { }

  //Team
  getCategries(idTeam : String): Observable<Category[]> {
    const token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
    return this.http.get<Category[]>(this.endpoint + `/teams/${idTeam}/categories`, httpOptions);
  }

  addCategory(idTeam : string,category : Category): Observable<Category> {
    console.log("ADD CAT ID TEAM ", idTeam);
    console.log("ADD CAT CATEGORY ", category);
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
    console.log ("categooorie aaaa", category);
    console.log ("categooorie ID TEAM", idTeam);
  return this.http.post<Category>(this.endpoint + `/teams/${idTeam}/categories`, category, httpOptions);
  }


  getCategory(idTeam : string, idCategory : string): Observable<Category> {
  const token = localStorage.getItem('token');
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
  }
  console.log("service CAT id team", idTeam);
  console.log("service CAT id category", idCategory);

    return this.http.get<Category>(this.endpoint + `/teams/${idTeam}/categories/${idCategory}`, httpOptions);
  }

  getIssues(idTeam : string, idCategory : string): Observable<Category> {
  const token = localStorage.getItem('token');
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
  }

    return this.http.get<Category>(this.endpoint + `/teams/${idTeam}/categories/${idCategory}/issues`, httpOptions);
  }

  deleteCategory(idTeam : String, idCategory : string): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'responseType': 'text',
        'Authorization': token
      })
    }
    return this.http.delete(this.endpoint + `/teams/${idTeam}/categories/${idCategory}`, httpOptions);
  }
}
