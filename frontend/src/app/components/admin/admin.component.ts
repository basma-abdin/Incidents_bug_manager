import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/models/user.model';
import { ToastComponent } from '../../shared/toast/toast.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: User[] = [];
  isLoading = true;

  constructor(public auth: AuthService,
  			  public toast: ToastComponent,
              private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => {
      console.log("get users", data);
      this.users = data;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  // deleteUser(user: User) {
  //   if (window.confirm('Are you sure you want to delete ' + user.name + '?')) {
  //     this.userService.deleteUser(user).subscribe(
  //       data => this.toast.setMessage('user deleted successfully.', 'success'),
  //       error => console.log(error),
  //       () => this.getUsers()
  //     );
  //   }
  // }

}
