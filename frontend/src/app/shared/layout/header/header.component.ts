import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/categoryWithType.type";
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  @Input() categories: CategoryWithTypeType[] = [];
  count: number = 0;
  productsFromSearch: ProductType[] = [];
  serverStaticPath = environment.serverStaticPath;
  showSearch: boolean = false;
  searchField = new FormControl();

  constructor(private authService: AuthService,
              private cartService: CartService,
              private productService: ProductService,
              private _snackBar: MatSnackBar,
              private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      this.getCartCount();
    })

    this.getCartCount();

    this.cartService.count$
      .subscribe(count => {
        this.count = count;
      })

    this.searchField.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.productsFromSearch = data;
              this.showSearch = true;
            })
        } else {
          this.productsFromSearch = [];
        }
      });
  }

  getCartCount() {
    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.count = (data as { count: number }).count;
      })
  }

  logOut(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          // if (data.error) {
          //   this._snackBar.open('Ошибка выхода из системы');
          //   throw new Error(data.message);
          // }
          this.doLogOut();
        },
        error: () => {
          this.doLogOut();
        }
      })
  }

  doLogOut(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  // changeSearchValue(newValue: string) {
  //   this.searchValue = newValue;
  //   if (this.searchValue && this.searchValue.length > 2) {
  //     this.productService.searchProducts(this.searchValue)
  //       .subscribe((data: ProductType[]) => {
  //         this.productsFromSearch = data;
  //       })
  //   } else {
  //     this.productsFromSearch = [];
  //   }
  // }

  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    this.searchField.setValue('');
    this.productsFromSearch = [];
  }

  changeShowSearch(value: boolean) {
    setTimeout(() => {
      this.showSearch = value;
    }, 100)
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.showSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showSearch = false;
    }
  }
}
