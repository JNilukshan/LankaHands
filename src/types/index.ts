
import type { Timestamp } from 'firebase/firestore';

// Note: StaticImageData is primarily for images imported directly in Next.js.
// For database URLs, 'string' is more appropriate.

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

export interface ContactDetails {
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface Artisan {
  id: string; // Corresponds to Firebase Auth UID if the artisan is also a user
  userId?: string; // Link to users collection (Firebase Auth UID) - can be same as id
  name:string;
  email?: string;
  bio: string;
  profileImageUrl: string;
  bannerImageUrl?: string;
  followers?: number;
  averageRating?: number;
  location?: string;
  speciality?: string;
  shippingSettings?: ShippingSettings;
  storePolicies?: StorePolicies;
  contactDetails?: ContactDetails;
  isVerified?: boolean;
  createdAt?: string; // ISO date string
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  category: string;
  images: string[];
  artisanId: string;
  artisanName?: string;
  reviews?: Review[];
  stock?: number;
  dimensions?: string;
  materials?: string[];
  isVisible?: boolean;
  tags?: string[];
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  comment: string;
  reviewTitle?: string;
  createdAt: string; // ISO date string
}

// This represents the structure of documents in the 'users' Firestore collection
export interface User {
  uid: string; // Firebase Auth UID - This IS the document ID
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  profileImageUrl?: string;
  wishlist?: string[]; // Array of product IDs
  followedArtisans?: string[]; // Array of artisan IDs
  artisanProfileId?: string; // If role is 'seller', this links to their document in 'artisanProfiles' (could be same as UID)
  createdAt: string; // ISO date string
  // shippingAddresses, paymentMethods etc. could be subcollections or arrays here
}


export interface Order {
  id: string;
  userId: string; // Firebase Auth UID of the buyer
  customerName?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingCost?: number;
  taxAmount?: number;
  grandTotal: number;
  orderDate: string; // ISO date string
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    recipientName?: string;
  };
  artisanId?: string;
  artisan?: Artisan;
  paymentDetails?: {
    paymentId: string;
    method: string;
    status: string;
  };
  trackingNumber?: string;
  lastUpdatedAt?: string; // ISO date string
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  priceAtPurchase: number;
  artisanId?: string;
}

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  image: string;
  quantity: number;
  artisanId?: string;
  artisanName?: string;
  stock?: number;
}


export interface SellerStats {
  totalSales: number;
  averageRating: number;
  followers: number;
  totalReviews: number;
  productsCount: number;
  pendingOrders: number;
}

export type NotificationType = 'new_order' | 'new_message' | 'new_review' | 'low_stock' | 'general';

export interface SellerNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string; // ISO date string
  read: boolean;
  link?: string;
  sender?: string;
  artisanId?: string;
}

// For AuthContext - this represents the currently logged-in user's state in the app.
// It should largely mirror the Firestore 'User' document structure.
export interface AuthenticatedUser {
  id: string; // Firebase Auth UID (maps to User.uid)
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  profileImageUrl?: string;
  followedArtisans?: string[];
  wishlist?: string[];
  artisanProfileId?: string; // Present if role is 'seller'
}
