import { getLocaleMonthNames } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number=0;
  totalQuantity: number=0;
  creditCardMonths: number[]=[];
  reditCardYears: number[]=[];

  countries: Country[] =[];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
                                  [Validators.required,
                                    Validators.minLength(2), 
                                    Luv2ShopValidators.notOnlyWhitespace]),
         lastName: new FormControl('',
                                    [Validators.required,
                                     Validators.minLength(2),
                                     Luv2ShopValidators.notOnlyWhitespace
        ]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required,
                                  Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, 
                                Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
                                  Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, 
                                  Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required,
                                Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
                                    Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required,
                                     Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    })

    //Populate Credit Card Month
    const startMonth = new Date().getMonth() +1; // js Zero Based
    console.log(`Start Month: `+ startMonth);
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log(`Retrieved Credit Card Months: `+JSON.stringify(data))
        this.creditCardMonths = data;
      }
    )

    // Populate Credit Card Years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data =>{
        console.log( `Retrieved Credit Card Years: `+JSON.stringify(data));
        this.reditCardYears = data;
      }
    )

    // Populate Countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log( `Retrieved Countries: `+JSON.stringify(data));
        this.countries  =data
      }
    )
  }


  reviewCartDetails(){
    // Subscribe To Cart Service.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity  = totalQuantity
    );
     // Subscribe TO CartService.totalPric
     this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
      );
  }

  //Validators=> Using Getter Methods To Accesss Form Control =>HTML FILE
  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName');}
  get email(){ return this.checkoutFormGroup.get('customer.email');}
  
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country')};
  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street')};
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city')};
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state')};
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode')};

  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country')};
  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street')};
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city')};
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state')};
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode')}

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType')};
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard')};
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber')};
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode')};  

  copyShippingAddressToBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value
      );
      //Bug Fix For State
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      //Bug Fix For States
      this.billingAddressStates = [];
    }
  }

  //Purchase
  onSubmit(){

    console.log(`Handling The Submit Button`);
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    //Set Up Order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //Get Cart Item
    const cartItems = this.cartService.cartItems;

    //Create OrderItems From CartItems
    //Long Way
    // let orderItems: OrderItem[] = [];
    // for(let i=0; i< cartItems.length; i++){
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }

    //Short Way
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //Setup Purchase
    let purchase = new Purchase();

    // Populate Purchase - Customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //Populate Purchase-ShippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state= shippingState.name;
    purchase.shippingAddress.country  =shippingCountry.name;

    // Populate Purchase - billing Address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //Populate Purchase - Order And OrderItem
    purchase.order = order;
    purchase.orderItems = orderItems;

    //Call Rest API Via The CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next:response => {
          alert(`Your Order Has Been Received. \n Order Tracking Number: ${response.orderTrackingNumber}`)
          //Reset Cart
          this.resetCart();
        },
        error: err=>{
          alert(`There Was An Error: ${err.message}`)
        }
      }
    );
  }
  resetCart(){
    //Reset Cart Date
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // Reset THe Form
    this.checkoutFormGroup.reset();

    // Navigate BackTo The Products Page
    this.router.navigateByUrl("/products");
  }
  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
        //If CurrentYear === selectedYear, Then Start With Current Month
        let startMonth:number;
      if(currentYear === selectedYear){
        startMonth = new Date().getMonth()+1;
      }else {
        startMonth=1;
      }
      this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
        data =>{
          console.log(`Retrieved Credit Card Months: `+JSON.stringify(data));
          this.creditCardMonths = data; 
        }
      )
  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    console.log(`${formGroupName} Country Code: ${countryCode}`);
    console.log(`${formGroupName} Country Name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        } else{
          this.billingAddressStates = data;
        }
        // Select First Item By Default
        formGroup.get('state').setValue(data[0]);
      }
    )
    
  }

}
