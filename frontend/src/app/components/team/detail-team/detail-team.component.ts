import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TeamService } from '../../../services/team.service';
import { UserService } from '../../../services/user.service';
import { Team } from '../../../shared/models/team.model';
import { User } from '../../../shared/models/user.model';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail-team',
  templateUrl: './detail-team.component.html',
  styleUrls: ['./detail-team.component.scss']
})
export class DetailTeamComponent implements OnInit {
  team: Team;
  isLoading = true;
  id:string;
  currentTeam: Team = new Team();

  members : User[];
  addMemberForm: FormGroup;
  member = new FormControl('', [
    Validators.required
  ]);

  constructor(public auth: AuthService,
              public toast: ToastComponent,
              private route: ActivatedRoute,
              private router:Router,
              private teamService: TeamService,
              private userService: UserService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addMemberForm = this.formBuilder.group({
      member: this.member
    });
    this.route.paramMap.subscribe (params => {
    this.id = String(params.get("id"));
    console.log("detail team - login", this.id);
  //  this.members = this.getUsers();
    console.log("members ; ", this.members);
    this.getTeam(this.id);

    })
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => {
      console.log("get users", data);
      this.members = data;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getTeam(id : string) {
    console.log("aaaaaaaaaa", id);
    this.teamService.getTeam(id).subscribe(
      data => {
        console.log(" Team ID ", id);
        console.log("data", data);
        this.team = data;
        console.log("get team detail ------", this.team);
        console.log("get team ID ------", this.team._id);
        console.log("get team name ------", this.team.name);
        console.log("get team creator ------", this.team.creator);
        console.log("get team members ------", this.team.members);
        console.log("get team categories ------", this.team.categories);
        console.log("ttttt----",this.auth.currentUser._id);

        this.currentTeam = data;
        console.log ("bbbbbbb");
        console.log("ttttttt*******", this.currentTeam._id);
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }
  deleteTeam(id : string) {
    if (window.confirm('Are you sure you want to delete team ?')) {
      this.teamService.deleteTeam(id).subscribe(
        data => {
          console.log("delete team ", data);
          this.toast.setMessage('team deleted successfully.', 'success');
          this.router.navigate(['/teams']);
        },
        error => console.log(error),
        () => this.teamService.getTeams()
      );
    }
  }

  deleteMember(id : string,idMember : string) {
    if (window.confirm('Are you sure you want to delete member ?')) {
      this.teamService.deleteMember(id, idMember).subscribe(
        data => {
          console.log("delete member ", data);
          this.toast.setMessage('member deleted successfully.', 'success');
          this.router.navigate(['/teams']);
        },
        error => console.log(error),
        () => this.teamService.getTeams()
      );
    }
  }

  onGoIssue(idCategory:string){
    let path="/teams/"+this.id+"/category/"+idCategory;

    console.log("path : ", path);
    this.router.navigate([path]);

  }
  // addMember(idTeam : string) {
  //   //this.team = this.addTeamForm.value;
  //   console.log("ttttt", this.team);
  //   //console.log("addd team form", this.addTeamForm.value);
  //   this.teamService.addTeam(this.idTeam).subscribe(
  //     res => {
  //       console.log("add team",res);
  //       this.toast.setMessage('you successfully added team!', 'success');
  //       this.router.navigate(['/teams']);
  //     },
  //     error => this.toast.setMessage('Error add team', 'danger')
  //   );
  // }
  // editTeam(team: Team){
  //   if (window.confirm('Are you sure you want to edit ' + team.name + '?')) {
  //     this.teamService.editTeam(team).subscribe(
  //       data => {
  //         console.log("edit team ", data);
  //         this.team = data;
  //         this.toast.setMessage('team edited successfully.', 'success');
  //         this.router.navigate(['/teams']);
  //       },
  //       error => console.log(error),
  //       () => this.teamService.getTeams()
  //     );
  //   }
  // }
}
