import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',

  templateUrl: './product-list-grid.component .html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  PreviousCategoryId: number = 1;
  searchMode: boolean = false;

  // New Properties For Pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  thePreviousKeyword: string = null;
  constructor(private productService: ProductService,
    private cartServie:CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  } 
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }
  handleSearchProducts() {
    const thekeyword: string = this.route.snapshot.paramMap.get('keyword');

    // If We Have A Different Keyword  Than Previous
    //  Then The PageNumber=1
    if (this.thePreviousKeyword != thekeyword) {
      this.thePageNumber = 1;
    }
    this.thePreviousKeyword = thekeyword;
    console.log(`Keyword=${thekeyword}, thePageNumber=${this.thePageNumber}`)
    // Now Search For The Products Using Keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      thekeyword).subscribe(this.processResult())
  }
  handleListProducts() {
    // Check If "id" Parameter Is Available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // Get The "id" Param String. Convert String To Number Using "+" Symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      //Not Category Id Available ... Default TO Category ID 1
      this.currentCategoryId = 1;
    }


    // Check If We Have A Different Category Than Previous
    // Note: Angullar Will Reuse A Component If It Is Currently Being Viewed


    //If We Have A Different Category Id Than Previous 
    //  Then Set thePageNumber Back To 1
    if (this.PreviousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.PreviousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId},
                thePageNumber=${this.thePageNumber}`);


    this.productService.getListProductPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(
        this.processResult());
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  //Cart Status
  addToCart(theProduct: Product){
    console.log(`Adding TO Cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    const theCartItem = new CartItem(theProduct);
    this.cartServie.addToCart(theCartItem);

  }


}
