import {Component, Input, OnInit} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {CategoryWithTypeType} from "../../../../types/categoryWithType.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() categories: CategoryWithTypeType[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
