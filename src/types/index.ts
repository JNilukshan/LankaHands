
import type { StaticImageData } from 'next/image';

export interface ShippingSettings {
  localRate?: number;
  localDeliveryTime?: string;
  internationalRate?: number;
  internationalDeliveryTime?: string;
  freeShippingLocalThreshold?: number;
  freeShippingInternationalThreshold?: number;
  processingTime?: string;
}

export interface StorePolicies {
  returnPolicy?: string;
  exchangePolicy?: string;
  cancellationPolicy?: string;
}

export interface Artisan {
  id: string;
  name: string;
  bio: string;
  profileImageUrl: string | StaticImageData;
  products?: Product[];
  followers?: number;
  averageRating?: number;
  location?: string;
  speciality?: string;
  shippingSettings?: ShippingSettings;
  storePolicies?: StorePolicies;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  category: string;
  images: (string | StaticImageData)[];
  artisanId: string;
  artisan?: Artisan;
  reviews?: Review[];
  stock?: number;
  dimensions?: string; 
  materials?: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string | StaticImageData;
  productId: string;
  rating: number; 
  comment: string;
  createdAt: string; 
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string | StaticImageData;
  isSeller: boolean;
}

export interface Order {
  id: string;
  userId: string;
  customerName?: string; 
  items: OrderItem[];
  totalAmount: number;
  orderDate: string; 
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress?: string;
  artisan?: Artisan; // Artisan fulfilling this order
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string | StaticImageData;
  quantity: number;
  price: number;
}

export interface SellerStats {
  totalSales: number;
  averageRating: number;
  followers: number;
  totalReviews: number;
  productsCount: number;
  pendingOrders: number;
}
