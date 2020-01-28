import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IssueService } from '../../../services/issue.service';
import { Issue } from '../../../shared/models/issue.model';
import { ToastComponent } from '../../../shared/toast/toast.component';


@Component({
  selector: 'app-detail-issue',
  templateUrl: './detail-issue.component.html',
  styleUrls: ['./detail-issue.component.scss']
})
export class DetailIssueComponent implements OnInit {
  issue : Issue;
  isLoading = true;
  idTeam : string;
  idCategory : string;
  idIssue:string;
  currentIssue: Issue = new Issue();
  constructor(public auth: AuthService,
              public toast: ToastComponent,
              private route: ActivatedRoute,
              private router:Router,
              private issueService: IssueService) { }

  ngOnInit() {
    this.route.paramMap.subscribe (params => {

      this.idTeam = String(params.get("idTeam"));
      //console.log("ID TEAM ", this.idTeam);

      this.idCategory = String(params.get("idCategory"));
      //console.log("ID CATEGORY ", this.idCategory);

      this.idIssue = String(params.get("idIssue"));
      //console.log("detail team - login", this.idIssue);
      this.getIssue(this.idIssue);
    })
  }

  getIssue(idIssue : string) {
    console.log("aaaaaaaaaa", this.idIssue);
    this.issueService.getIssue(this.idIssue).subscribe(
      data => {
        this.issue = data;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  deleteIssue(idIssue : string) {
    if (window.confirm('Are you sure you want to delete issue ?')) {
      this.issueService.deleteIssue(this.idIssue).subscribe(
        data => {
          this.toast.setMessage('Issue deleted successfully.', 'success');
          this.router.navigate([`/teams/${this.idTeam}/category/${this.idCategory}`]);
        },
        error => console.log(error),
        () => this.issueService.getIssues()
      );
    }
  }

  editIssue(idIssue : string) {
    if (window.confirm('Are you sure you want to delete issue ?')) {
      this.issueService.deleteIssue(this.idIssue).subscribe(
        data => {
          console.log("delete team ", data);
          this.toast.setMessage('Issue deleted successfully.', 'success');
          this.router.navigate([`/teams/${this.idTeam}`]);
        },
        error => console.log(error),
        () => this.issueService.getIssues()
      );
    }
  }

}
