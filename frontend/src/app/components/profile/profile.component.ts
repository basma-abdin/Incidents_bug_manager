import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;
  //isLoading = true;
  constructor(private auth: AuthService,
              public toast: ToastComponent,
              private userService: UserService) { }

  ngOnInit() {
    this.getUser();
  }
  getUser() {
    this.userService.getUser(this.auth.currentUser).subscribe(
      data => {
        console.log("profile user",data);
        this.user = data;
      },
      error => console.log(error)
      //() => this.isLoading = false
    );
  }

  save(user: User) {
    this.userService.editUser(user).subscribe(
      res => {
        console.log("result save", res);
        this.toast.setMessage('account settings saved!', 'success');
        this.auth.currentUser = user;
      },
      error => console.log(error)
    );
  }

}
