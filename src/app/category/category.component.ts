import { Component, OnInit, TemplateRef } from '@angular/core';
import { Category } from '../category';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[];
  modalRef: BsModalRef;
  newCategory = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(
    private categoryService: CategoryService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  add(): void {
    this.newCategory.disable();
    const category = {
      name: this.newCategory.value.name
    } as Category;
    this.categoryService.addCategory(category).subscribe(
      newCategory => {
        this.categories.push(newCategory);
        this.newCategory.reset();
      },
      error => {},
      () => {
        this.newCategory.enable();
        this.modalRef.hide();
      }
    );
  }

  delete(category: Category): void {
    this.categories = this.categories.filter(h => h !== category);
    this.categoryService.deleteCategory(category).subscribe();
  }
}
