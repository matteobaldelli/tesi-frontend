import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { CategoryService } from '../category.service';

import { Category } from '../category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  @ViewChild('form')
  private templateForm: TemplateRef<any>;
  categories: Category[];
  modalRef: BsModalRef;
  titleForm: string;
  categoryForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true}),
    name: new FormControl('', Validators.required),
  });
  categorySubscription: Subscription;

  constructor(
    private categoryService: CategoryService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }

  add(): void {
    this.titleForm = 'Aggiungi';
    this.modalRef = this.modalService.show(this.templateForm, { keyboard: false });
  }

  edit(category: Category): void {
    this.titleForm = 'Modifica';
    this.categoryForm.setValue({
      id: category.id,
      name: category.name
    });
    this.modalRef = this.modalService.show(this.templateForm, { keyboard: false });
  }

  onSubmit(): void {
    this.categoryForm.disable();
    const category = {
      id: this.categoryForm.value.id,
      name: this.categoryForm.value.name
    } as Category;
    if (category.id) {
      this.onSubmitUpdate(category);
    } else {
      this.onSubmitAdd(category);
    }
  }

  private onSubmitAdd(category: Category): void {
    this.categoryService.addCategory(category).subscribe(
      newCategory => {
        this.categories.push(newCategory);
      },
      error => {},
      () => {
        this.categoryForm.enable();
        this.hideForm();
      }
    );
  }

   private onSubmitUpdate(category: Category): void {
    this.categoryService.updateCategory(category).subscribe(
      updateCategory => {
        const index = this.categories.findIndex(c => c.id === updateCategory.id);
        this.categories[index] = updateCategory;
      },
      error => {},
      () => {
        this.categoryForm.enable();
        this.hideForm();
      }
    );
  }

  delete(category: Category): void {
    this.categories = this.categories.filter(h => h !== category);
    this.categoryService.deleteCategory(category).subscribe();
  }

  hideForm(): void {
    this.categoryForm.reset();
    this.modalRef.hide();
  }
}
