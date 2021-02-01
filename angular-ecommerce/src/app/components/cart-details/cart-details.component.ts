import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] =[];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
    // Get A Handle To The Cart Items
    this.cartItems = this.cartService.cartItems;

    // Subscribe To The Cart TotalPrice
     this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // Subscribe To The Cart TotalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // Compute Cart TotalPrice And TotalQuantity
    this.cartService.computeCartTotals();
  }
  incrementQuantity(theCartItem: CartItem){
    this.cartService.addToCart(theCartItem);
  }
  decrementQuantity(theCartItem: CartItem){
    this.cartService.decrementQuantity(theCartItem);
  }

  //Remove Quantity
  remove(theCartItem:CartItem){
    this.cartService.remove(theCartItem);
  }
}
