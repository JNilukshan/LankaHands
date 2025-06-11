import type { StaticImageData } from 'next/image';

export interface Artisan {
  id: string;
  name: string;
  bio: string;
  profileImageUrl: string | StaticImageData;
  products?: Product[]; // Optional, linking back might be complex for simple display
  followers?: number;
  averageRating?: number;
  location?: string;
  speciality?: string;
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
  dimensions?: string; // e.g., "10cm x 15cm x 5cm"
  materials?: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string | StaticImageData;
  productId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string; // ISO date string
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
  items: OrderItem[];
  totalAmount: number;
  orderDate: string; // ISO date string
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress?: string;
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
