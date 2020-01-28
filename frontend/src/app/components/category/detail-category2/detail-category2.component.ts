import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { TeamService } from '../../../services/team.service';
import { Category } from '../../../shared/models/category.model';
import { ToastComponent } from '../../../shared/toast/toast.component';

@Component({
  selector: 'app-detail-category2',
  templateUrl: './detail-category2.component.html',
  styleUrls: ['./detail-category2.component.scss']
})
export class DetailCategory2Component implements OnInit {
  category: Category;
  name : string = "title";
  idTeam : string;
  idCategory : string;
  isLoading = true;
  constructor(public auth: AuthService,
              public toast: ToastComponent,
              private route: ActivatedRoute,
              private router:Router,
              private categoryService: CategoryService) { }

  ngOnInit() {
    this.route.paramMap.subscribe (params => {
      this.idTeam = String(params.get("idTeam"));
      console.log("ID TEAM ", this.idTeam);
      this.idCategory = String(params.get("idCategory"));
      console.log("ID CATEGORY ", this.idCategory);

      this.getCategory(this.idTeam,this.idCategory);
    });
  }

  getCategory(idTeam : string, idCategory : string) {
    this.categoryService.getCategory(this.idTeam,this.idCategory).subscribe(
      data => {
        //console.log("data category", data);
        var jsonData=JSON.parse(JSON.stringify(data));
        this.category=JSON.parse(JSON.stringify(jsonData.category)) as Category;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  deleteCategory(idTeam : string, idCategory : string) {
    if (window.confirm('Are you sure you want to delete this category ?')) {
      this.categoryService.deleteCategory(this.idTeam,this.idCategory).subscribe(
        data => {
          this.toast.setMessage('Category deleted successfully.', 'success');
          this.router.navigate([`/teams/${this.idTeam}`]);
        },
        error => console.log(error),
        () => this.categoryService.getCategries(this.idTeam)
      );
    }
  }

}
