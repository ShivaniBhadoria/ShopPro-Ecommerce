import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product-list-data.service';
import { Product } from '../models/product.model';
import { MatDialog } from '@angular/material/dialog';
import { SizeChartComponent } from '../dialogs/size-chart/size-chart.component';
import { Router } from '@angular/router';
import { CartService } from '../services/cart-details-data.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  productData: Product[] = [];
  product: any;
  selectedColor: string = '';
  selectedSize: string = '';
  quantity: number = 1;
  minQuantity: number = 1;
  maxQuantity: number = 100;
  rating: number = 0;
  isSizeDropdownOpen: boolean = false;
  fullStars: number[] = [];
  halfStar: boolean = false;
  emptyStars: number[] = [];
  addToCartLabel: string = "ADD TO CART";
  wishlistLabel: string = "WISHLIST";
  showAlert = false;

  constructor(private route: ActivatedRoute, private productService: ProductService, 
    private router: Router, public dialog: MatDialog,
    private cartService: CartService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id !== null){
        this.productService.getProducts().subscribe(data => {
          this.productData = data.productDetails;
          this.getProductDetails(id);
        }, error => {
          console.error('Error fetching product details:', error);
        });
      }
    });
  }

  getProductDetails(id:any){
    this.product = this.productData.find(product => product.id === +id);
    this.product.discountedPrice = this.calculateDiscountedPrice(this.product.price, this.product.discount);
    this.product.addToCartLabel = 'Add To Cart';
    this.selectedColor = this.product.colorsAvailable[0];
    this.selectedSize = this.product.sizeAvailable[0];
    this.rating = this.product.ratings;
    if(this.product.isAddedToWishlist) {
      this.wishlistLabel = "WISHLISTED";
    }
    this.calculateStars();
  }

  calculateDiscountedPrice(price: number, discount: number): number {
    const discountedPrice = price - (price * discount / 100);
    return Math.floor(discountedPrice);
  }

  onColorChange(event: any): void {
    console.log('Selected color:', event.value);
    this.selectedColor = event.value;
  }

  calculateStars(): void {
    const integerPart = Math.floor(this.rating);
    const fractionalPart = this.rating - integerPart;
    this.fullStars = Array(integerPart).fill(0);

    if (fractionalPart >= 0.5) {
      this.halfStar = true;
    }

    const totalStars = this.halfStar ? integerPart + 1 : integerPart;
    this.emptyStars = Array(5 - totalStars).fill(0);
  }

  decreaseQuantity(): void {
    if (this.quantity > this.minQuantity) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    if (this.quantity < this.maxQuantity) {
      this.quantity++;
    }
  }

  updateQuantity(newQuantity: number): void {
    if (newQuantity < this.minQuantity) {
      this.quantity = this.minQuantity;
    } else if (newQuantity > this.maxQuantity) {
      this.quantity = this.maxQuantity;
    } else {
      this.quantity = newQuantity;
    }
  }

  toggleSizingDropdown(isOpen: boolean): void{
    this.isSizeDropdownOpen = isOpen;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    this.isSizeDropdownOpen = false;
  }

  openSizeChart(): void {
    this.dialog.open(SizeChartComponent, {
      width: '500px',
      height: '560px',
      autoFocus: false,
      panelClass: 'size-chart-modal',
      data: {
        gender: this.product.gender,
        brand: this.product.brand
      }
    });
  }

  addToCart(event:any, product:any) {
    this.addToCartLabel = 'GO TO CART';
    if(!product.isAddedToCart){
      product.isAddedToCart = true;
      product.addToCartLabel = 'Go To Cart';
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 1000);
      this.productService.sendCartItemCount(1);
      this.cartService.sendCartProducts([product]);
    } else {
      this.router.navigate(['/cart']);
    }
  }

  addToWishlist(event:any) {
    this.wishlistLabel = 'WISHLISTED';
  }

  closeAlert() {
    this.showAlert = false;
  }
    
}
