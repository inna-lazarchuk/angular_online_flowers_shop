import { Component, OnInit } from '@angular/core';
import {CategoryType} from "../../../types/category.type";
import {CategoryService} from "../services/category.service";
import {CategoryWithTypeType} from "../../../types/categoryWithType.type";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  categories: CategoryWithTypeType[] = [];
  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategoriesWithTypes()
      .subscribe((categories: CategoryWithTypeType[]) => {
        this.categories = categories.map(item => {
          return Object.assign({typeUrl: item.types.map(item => item.url)}, item);
        })
      })
  }

}
