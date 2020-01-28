import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { TeamService } from '../../../services/team.service';
import { Category } from '../../../shared/models/category.model';
import { ToastComponent } from '../../../shared/toast/toast.component';

@Component({
  selector: 'app-detail-category',
  templateUrl: './detail-category.component.html',
  styleUrls: ['./detail-category.component.scss']
})
export class DetailCategoryComponent implements OnInit {

  cat: Category;

  idTeam : string;
  idCategory : string;

  name : string = "titre";

  isLoading = true;
  currentCategory : Category = new Category();

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

    //this.getCategory(this.idTeam,this.idCategory);
    })
  }
  // getCategory(idTeam : string, idCategory : string) {
  //   console.log("GET CAT ID CAT", this.idCategory);
  //   console.log("GET CAT ID TEAM", this.idTeam);
  //   this.categoryService.getCategory(this.idTeam,this.idCategory).subscribe(
  //     data => {
  //       console.log("data category", data);
  //       this.cat = data.category;
  //       console.log("get category detail ------", this.cat);
  //       console.log("get category ID ------", this.cat._id);
  //       console.log("get category name ------", this.cat.name);
  //       console.log("get category color ------", this.cat.color);
  //       console.log("get category issues ------", this.cat.issues);
  //       //console.log("ttttt----",this.auth.currentUser._id);
  //       this.name = this.cat.name;
  //       console.log("nnnnn", this.name);
  //       this.currentCategory = data;
  //       console.log ("bbbbbbb");
  //       console.log("ttttttt*******", this.currentCategory._id);
  //     },
  //     error => console.log(error),
  //     () => this.isLoading = false
  //   );
  // }

}




  //
  //
  //
  // deleteTeam(id : string) {
  //   if (window.confirm('Are you sure you want to delete team ?')) {
  //     this.teamService.deleteTeam(id).subscribe(
  //       data => {
  //         console.log("delete team ", data);
  //         this.toast.setMessage('team deleted successfully.', 'success');
  //         this.router.navigate(['/teams']);
  //       },
  //       error => console.log(error),
  //       () => this.teamService.getTeams()
  //     );
  //   }
  // }
  //
  // deleteMember(id : string,idMember : string) {
  //   if (window.confirm('Are you sure you want to delete member ?')) {
  //     this.teamService.deleteMember(id, idMember).subscribe(
  //       data => {
  //         console.log("delete member ", data);
  //         this.toast.setMessage('member deleted successfully.', 'success');
  //         this.router.navigate(['/teams']);
  //       },
  //       error => console.log(error),
  //       () => this.teamService.getTeams()
  //     );
  //   }
  // }

  // addMember() {
  //   this.team = this.addTeamForm.value;
  //   console.log("ttttt", this.team);
  //   //console.log("addd team form", this.addTeamForm.value);
  //   this.teamService.addTeam(this.team).subscribe(
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
