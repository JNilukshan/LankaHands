
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

export interface Artisan {
  id: string;
  userId?: string; // Link to users collection (Firebase Auth UID)
  name:string; // This could be publicName or brandName
  email?: string;
  bio: string;
  profileImageUrl: string; // URL from Firebase Storage
  bannerImageUrl?: string; // URL from Firebase Storage for profile banner
  followers?: number;
  averageRating?: number;
  location?: string;
  speciality?: string;
  shippingSettings?: ShippingSettings;
  storePolicies?: StorePolicies;
  isVerified?: boolean;
  createdAt?: string; // ISO date string
  // products?: Product[]; // Typically not stored directly on artisan, fetched separately
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  category: string;
  images: string[]; // Array of image URLs from Firebase Storage
  artisanId: string;
  artisanName?: string; // Denormalized for easier display
  reviews?: Review[];
  stock?: number;
  dimensions?: string;
  materials?: string[];
  isVisible?: boolean; // To control product visibility
  tags?: string[];
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string; // URL from Firebase Storage
  productId: string;
  rating: number;
  comment: string;
  reviewTitle?: string;
  createdAt: string; // ISO date string
}

export interface User { // More for your Firestore 'users' collection doc
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  profileImageUrl?: string; // URL from Firebase Storage
  wishlist?: string[]; // Array of product IDs
  followedArtisans?: string[]; // Array of artisan IDs
  artisanProfileId?: string; // Link to their artisanProfiles document if role is 'seller'
  createdAt?: string; // ISO date string
}

export interface Order {
  id: string;
  userId: string; // Firebase Auth UID of the buyer
  customerName?: string; // Denormalized
  items: OrderItem[];
  totalAmount: number; // Subtotal of items
  shippingCost?: number;
  taxAmount?: number;
  grandTotal: number; // Total including shipping and tax
  orderDate: string; // ISO date string
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    recipientName?: string;
  };
  artisanId?: string; // If order is for a single artisan, or primary artisan
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
  image: string; // Product image URL
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

// For AuthContext - this represents the currently logged-in user's state in the app
export interface AuthenticatedUser {
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  profileImageUrl?: string; 
  followedArtisans?: string[]; 
  wishlist?: string[]; 
  // artisanProfileId might be fetched separately if needed in context, or derived
}

