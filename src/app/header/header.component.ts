import { Component } from '@angular/core';
import { ProductService } from '../services/product-list-data.service';
import { Product } from '../models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  navbarOpen = false;
  isDropdownOpen = false;
  cartItemCount = 0;
  cartItems: Product[] = [];
  
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.cartItemCount$.subscribe(data => {
      this.cartItemCount = data;
    });
    this.getCartDetails();
  }
  
  getCartDetails(): void {
    this.productService.getCartDetails().subscribe(data => {
        this.cartItems = data.cartItems.productsInCart;
        this.cartItemCount = data.cartItems.cartItemCount;
      },
      error => {
        console.error('Error fetching cart details:', error);
      }
    );
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  openDropdown(isOpen:boolean) {
    this.isDropdownOpen = isOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
