import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../shared/models/category.model';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  category: Category;
  idTeam : string;
  isLoading = true;
  colors : string[] = ["Gray", "Red", "Silver", "Pink", "Blue", "Yellow", "Green", "Orange", "Purple"]

  addCategoryForm: FormGroup;
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(30),
    Validators.pattern('[a-zA-Z0-9_-\\s]*')
  ]);
  color = new FormControl('', [
    Validators.required
  ]);

  constructor(public auth: AuthService,
              public toast: ToastComponent,
              private router: Router,
              private route: ActivatedRoute,
              private categoryService: CategoryService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.addCategoryForm = this.formBuilder.group({
      name: this.name,
      color: this.color.value
    });
    this.route.paramMap.subscribe (params => {
    this.idTeam = String(params.get("idT"));

    // console.log("detail category - iidd", this.idTeam);
    // console.log("Category ADD FORM ", this.addCategoryForm.value);
    })

}

  addCategory() {
    this.category = this.addCategoryForm.value;
    this.categoryService.addCategory(this.idTeam,this.category).subscribe(
      res => {
        //console.log("add team",res);
        this.toast.setMessage('you successfully added category!', 'success');
        this.router.navigate([`/teams/${this.idTeam}`]);
      },
      error => this.toast.setMessage('Error add category', 'danger')
    );
  }

  setClassName() {
    return { 'has-danger': !this.name.pristine && !this.name.valid };
  }

}
