import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Services
import { AuthGuardLoginService } from './services/auth-guard-login.service';
import { AuthGuardAdminService } from './services/auth-guard-admin.service';
// Components
import { HomeComponent } from './/components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { TeamComponent } from './components/team/team.component';
import { AdminComponent } from './components/admin/admin.component';
import { DetailTeamComponent } from './components/team/detail-team/detail-team.component';
import { AddTeamComponent } from './components/team/add-team/add-team.component';
import { IssueComponent } from './components/issue/issue.component';
import { MemberComponent } from './components/member/member.component';
import { CategoryComponent } from './components/category/category.component';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
// import { DetailCategoryComponent } from './components/category/detail-category/detail-category.component';
import { DetailCategory2Component } from './components/category/detail-category2/detail-category2.component';
import { DetailIssueComponent } from './components/issue/detail-issue/detail-issue.component';
import { AddIssueComponent } from './components/issue/add-issue/add-issue.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'teams/addTeam', component: AddTeamComponent },
  { path: 'teams', component: TeamComponent },
  { path: 'teams/:id', component: DetailTeamComponent },
  { path: 'issues', component: IssueComponent },
  { path: 'teams/:idTeam/category/:idCategory/issues/:idIssue', component: DetailIssueComponent },
  { path: 'teams/:idTeam/category/:idCategory/issues/addIssue', component: AddIssueComponent },
  { path: 'member', component: MemberComponent },
  { path: 'teams/:idT/category/addCategory', component: AddCategoryComponent },
  { path: 'teams/:idTeam/category/:idCategory', component: DetailCategory2Component },
  { path: 'category', component: CategoryComponent },
  { path: '**', redirectTo: '/notfound' },
  // /teams/{{team._id}}categories/{{category._id}}
  //  children: [{
  //       path: '',
  //       loadChildren: '.component/team/detail-team/detail-team.component#DetailTeamComponent',
  //     }
  //   ]
  // }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
