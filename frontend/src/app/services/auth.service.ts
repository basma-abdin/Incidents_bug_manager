import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

import { UserService } from './user.service';
import { User } from '../shared/models/user.model';
import { Team } from '../shared/models/team.model';

import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  isAdmin = false;

  currentUser: User = new User();


  constructor(private userService: UserService,
              private router: Router,
              private jwtHelper: JwtHelperService) {
   /* const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = this.decodeUserFromToken(token);
      this.setCurrentUser(decodedUser);
    }
    */
  }

 login(emailAndPassword) {

    return this.userService.login(emailAndPassword).map(
      res => {

      	console.log("resuult" , res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user._id);
        localStorage.setItem('name', res.user.name);
        localStorage.setItem('email', res.user.email);
        localStorage.setItem('issues', res.user.issues);
        localStorage.setItem('role', res.user.role);
        // const decodedUser = this.decodeUserFromToken(res.token);
        // this.setCurrentUser(decodedUser);
       this.loggedIn = true;
        // if(res.user.role == "ADMIN"){
        //   this.isAdmin = true;
        // }
        res.user.role === 'ADMIN' ? this.isAdmin = true : this.isAdmin = false;
        console.log( "res role" , res.user.role);
        console.log("isAdmin ?" , this.isAdmin);
        this.currentUser = res;
        console.log("uuuuu*****ID", this.currentUser._id);
        console.log("uuuuu*****ROLE", this.currentUser.role);
        return this.loggedIn;
      }
    );
  }

  decodeUserFromToken(token) {
    return this.jwtHelper.decodeToken(token).user;
  }
   setCurrentUser(decodedUser) {
    this.loggedIn = true;
    console.log("current user" , decodedUser);
    this.currentUser._id = decodedUser._id;
    this.currentUser.name = decodedUser.name;
    this.currentUser.role = decodedUser.role;
    decodedUser.role === 'admin' ? this.isAdmin = true : this.isAdmin = false;
    delete decodedUser.role;
  }
  logout() {
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.isAdmin = false;
    this.currentUser = new User();
    this.router.navigate(['/']);
  }


}
