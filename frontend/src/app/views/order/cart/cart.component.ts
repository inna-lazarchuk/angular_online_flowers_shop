import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {environment} from "../../../../environments/environment";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  extraProducts: ProductType[] = [];
  serverStaticPath = environment.serverStaticPath;
  totalAmount: number = 0;
  totalCount: number = 0;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  cart: CartType | null = null;

  constructor(private productService: ProductService,
              private cartServices: CartService) {
  }

  ngOnInit(): void {
    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.extraProducts = data;
      });

    this.cartServices.getCart()
      .subscribe((data: CartType | DefaultResponseType) => {
       if((data as DefaultResponseType).error !== undefined) {
         const error = (data as DefaultResponseType).message;
         throw new Error(error);
       }
        this.cart = data as CartType;
        this.calculateTotal();
      })


  }

  calculateTotal() {
    this.totalCount = 0;
    this.totalAmount =0;

    if (this.cart) {
      this.cart.items.forEach(item => {
        this.totalAmount += item.quantity * item.product.price;
        this.totalCount +=item.quantity;
      })
    }
  }

  updateCount(id: string, count: number) {
    if (this.cart){
      this.cartServices.updateCart(id, count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }

          this.cart = data as CartType;
          this.calculateTotal();
        });
    }

  }

}
