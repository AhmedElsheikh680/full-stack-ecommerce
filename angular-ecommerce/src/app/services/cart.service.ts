import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  // totalPrice:Subject<number> = new Subject<number>();
  // totalQuantity: Subject<number> = new Subject<number>();
  totalPrice:Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }
  addToCart(TheCartItem: CartItem){
    // Check If  Aleardy Have The Item In Our Cart
    let alreadyExistsInItem: boolean= false;
    let existingCartItem: CartItem  = undefined;
    if(this.cartItems.length > 0){
      // Find The item In The Cart Based On  Item Id

      // for(let tempCartItem of this.cartItems){
      //   if(tempCartItem.id === TheCartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
        
      //   }
      // }
      // Using Another For loop
      existingCartItem = this.cartItems.find(tempCartItem =>tempCartItem.id === TheCartItem.id);

      // Check We Found It
      alreadyExistsInItem = (existingCartItem != undefined);
    }
    if(alreadyExistsInItem){
      // Increment The Quantity
      existingCartItem.quantity++;
    }else {
      // Just Add The Item To The Array
      this.cartItems.push(TheCartItem);
    }
    
    this.computeCartTotals();
  }
  computeCartTotals(){
    let totalPriceValue: number =0;
    let totalquantityValue: number = 0;
    for(let currentCartItem of this.cartItems){
      totalPriceValue +=  currentCartItem.quantity * currentCartItem.unitPrice;
      totalquantityValue += currentCartItem.quantity;
    }
    // Publish The New Values...All Subscribers Will Recieve The New Data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalquantityValue);

    this.logCartItem(totalPriceValue, totalquantityValue);
  }
  logCartItem(totalPriceValue:number, totalquantityValue: number){
    console.log(`Contents Of The Cart`);
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.unitPrice * tempCartItem.quantity;
      console.log(`Name: ${tempCartItem.name}, Quantity=${tempCartItem.quantity}, 
       unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
    console.log(`TotalPrice=${totalPriceValue.toFixed(2)}, TotalQuantity=${totalquantityValue}`);
    console.log(`---------------`);
  }
  decrementQuantity(theCartItem: CartItem){
    theCartItem.quantity--;
    if(theCartItem.quantity == 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem:CartItem){
    //Get Index Of Item In The Array
    const itemIndex = this.cartItems.findIndex(tempCartItem =>tempCartItem.id === theCartItem.id);
   //If Found, Then Remove Item From Array At Given Index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
