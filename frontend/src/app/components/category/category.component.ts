import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { TeamService } from '../../services/team.service';
import { Category } from '../../shared/models/category.model';
import { ToastComponent } from '../../shared/toast/toast.component';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


}

//
//
// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { TeamService } from '../../services/team.service';
// import { Team } from '../../shared/models/team.model';
// import { ToastComponent } from '../../shared/toast/toast.component';
//
// @Component({
//   selector: 'app-team',
//   templateUrl: './team.component.html',
//   styleUrls: ['./team.component.scss']
// })
// export class TeamComponent implements OnInit {
//   teams: Team[] = [];
//   isLoading = true;
//   constructor(public auth: AuthService,
//   			      public toast: ToastComponent,
//               private teamService: TeamService) { }
//
//   ngOnInit() {
//     this.getTeams();
//   }
//
//   getTeams() {
//     this.teamService.getTeams().subscribe(
//       data => {
//       console.log("team " ,data);
//       this.teams = data;
//       },
//       error => console.log(error),
//       () => this.isLoading = false
//     );
//   }
//   deleteTeam(id : string) {
//     if (window.confirm('Are you sure you want to delete ' + id + '?')) {
//       this.teamService.deleteTeam(id).subscribe(
//         data => {
//           console.log("delete team ", data);
//           this.toast.setMessage('user deleted successfully.', 'success');
//         },
//         error => console.log(error),
//         () => this.getTeams()
//       );
//     }
//   }
//
// }
