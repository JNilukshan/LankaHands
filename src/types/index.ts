
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
  name:string;
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
  artisan?: Artisan; // Optional: For direct access if product data includes full artisan details
  reviews?: Review[];
  stock?: number; // Number of items in stock
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

// Represents an item *within an order* after it's placed
export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string | StaticImageData;
  quantity: number;
  price: number; // Price per unit at the time of order
}

// Represents an item *in the shopping cart* before an order is placed
export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number; // Current price per unit
  image: string | StaticImageData; // Main product image
  quantity: number;
  artisanId?: string;
  artisanName?: string;
  stock?: number; // Available stock for the product
}


export interface SellerStats {
  totalSales: number;
  averageRating: number;
  followers: number;
  totalReviews: number;
  productsCount: number;
  pendingOrders: number;
}

// This type is for the seller dashboard notifications
export type NotificationType = 'new_order' | 'new_message' | 'new_review' | 'low_stock' | 'general';

export interface SellerNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string; // Stored as ISO string, converted to Date object in component
  read: boolean;
  link?: string; 
  sender?: string; 
  artisanId?: string; // To associate notification with a specific artisan (for multi-seller platforms)
}
