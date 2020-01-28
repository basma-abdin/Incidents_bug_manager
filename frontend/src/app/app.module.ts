import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// Modules
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
// Services
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardLoginService } from './services/auth-guard-login.service';
import { AuthGuardAdminService } from './services/auth-guard-admin.service';

// Components
import { AppComponent } from './app.component';
import { SharedComponent } from './shared/shared.component';
import { ServicesComponent } from './services/services.component';
import { ComponentsComponent } from './components/components.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';

import { JwtModule } from '@auth0/angular-jwt';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TeamComponent } from './components/team/team.component';
import { DetailTeamComponent } from './components/team/detail-team/detail-team.component';
import { AddTeamComponent } from './components/team/add-team/add-team.component';
import { IssueComponent } from './components/issue/issue.component';
import { CategoryComponent } from './components/category/category.component';
import { MemberComponent } from './components/member/member.component';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
// import { DetailCategoryComponent } from './components/category/detail-category/detail-category.component';
import { DetailCategory2Component } from './components/category/detail-category2/detail-category2.component';
import { DetailIssueComponent } from './components/issue/detail-issue/detail-issue.component';
import { AddIssueComponent } from './components/issue/add-issue/add-issue.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    SharedComponent,
    ServicesComponent,
    ComponentsComponent,
    AdminComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    LogoutComponent,
    ProfileComponent,
    TeamComponent,
    DetailTeamComponent,
    AddTeamComponent,
    IssueComponent,
    CategoryComponent,
    MemberComponent,
    AddCategoryComponent,
    //DetailCategoryComponent,
    DetailCategory2Component,
    DetailIssueComponent,
    AddIssueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppRoutingModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        // whitelistedDomains: ['localhost:3000', 'localhost:4200']
      }
    })
  ],
  providers: [
    AuthService,
    AuthGuardLoginService,
    AuthGuardAdminService,
    UserService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
