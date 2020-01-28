import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IssueService } from '../../services/issue.service';
import { Issue } from '../../shared/models/issue.model';
import { ToastComponent } from '../../shared/toast/toast.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit {
  issues: Issue[] = [];
  isLoading = true;
  id : number;
  constructor(public auth: AuthService,
  			      public toast: ToastComponent,
              //private router: Router,
              private issueService: IssueService) { }

  ngOnInit() {
    this.getIssues();
  }

  getIssues() {
    this.issueService.getIssues().subscribe(
      data => {
      console.log("issue " ,data);
      this.issues = data;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }
}
