import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TeamService } from '../../../services/team.service';
import { Team } from '../../../shared/models/team.model';
import { ToastComponent } from '../../../shared/toast/toast.component';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss']
})
export class EditTeamComponent implements OnInit {

  team: Team;
  isLoading = true;

  constructor(public auth: AuthService,
              public toast: ToastComponent,
              //private route: ActivatedRoute,
              private router:Router,
              private teamService: TeamService) { }

  ngOnInit() {
  }

}
