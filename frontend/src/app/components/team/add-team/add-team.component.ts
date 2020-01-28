import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TeamService } from '../../../services/team.service';
import { Team } from '../../../shared/models/team.model';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {

  team: Team;
  isLoading = true;

  addTeamForm: FormGroup;
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
    Validators.pattern('[a-zA-Z0-9_-\\s]*')
  ]);
  // creator : string;
  // members : string [];
  // categories : string [];

  constructor(public auth: AuthService,
              public toast: ToastComponent,
              private router: Router,
              private teamService: TeamService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addTeamForm = this.formBuilder.group({
      name: this.name,
      // creator:localStorage.getItem("userId"),
      // members:localStorage.getItem("userId"),
      // categories:this.categories
    });
    console.log ("TEEAM ADD ", this.addTeamForm);
  }

  setClassName() {
    return { 'has-danger': !this.name.pristine && !this.name.valid };
  }

  addTeam() {
    this.team = this.addTeamForm.value;
    console.log("ttttt", this.team);
    console.log("addd team form", this.addTeamForm.value);
    this.teamService.addTeam(this.team).subscribe(
      res => {
        console.log("add team",res);
        this.toast.setMessage('you successfully added team!', 'success');
        this.router.navigate(['/teams']);
      },
      error => this.toast.setMessage('Error add team', 'danger')
    );
  }
}
