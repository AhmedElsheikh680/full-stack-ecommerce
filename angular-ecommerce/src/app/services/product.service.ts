import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';
  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  //Pagination
  getListProductPaginate(thePage: number,
    thePagSize: number,
    theCategoryId: number): Observable<GetResponseProducts> {
      // Need To Build URL Based on Category ID , Page & Size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePagSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getListProduct(theCategoryId: number): Observable<Product[]> {
    // Need To Build URL Based On Category ID
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(thekeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${thekeyword}`;

    return this.getProducts(searchUrl);

  }

searchProductsPaginate(thePage:number,
                        thePageSize: number,
                        theKeyword: string): Observable<GetResponseProducts>{
    // Need To Build URL Based On Keyword, Page & Size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                        +`&page=${thePage}&size=${thePageSize};`
    return this.httpClient.get<GetResponseProducts>(searchUrl);
}

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(Response => Response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(Response => Response._embedded.productCategory)
    )
  }


}
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
