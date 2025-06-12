
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
  name:string;
  email?: string;
  bio: string;
  profileImageUrl: string; // URL from Firebase Storage
  // products?: Product[]; // Typically not stored directly on artisan, fetched separately
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
  images: string[]; // Array of image URLs from Firebase Storage
  artisanId: string;
  artisanName?: string; // Denormalized for easier display
  // artisan?: Artisan; // Usually fetched separately or linked by artisanId
  reviews?: Review[];
  stock?: number;
  dimensions?: string;
  materials?: string[];
  isVisible?: boolean; // To control product visibility
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

export interface User { // This might be more for a general user type, AuthenticatedUser is more specific
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  profileImageUrl?: string; // URL from Firebase Storage
  // isSeller: boolean; // Redundant if using 'role' in AuthenticatedUser
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
  shippingAddress?: { // Could be a more structured object
    street: string;
    city: string;
    postalCode: string;
    country: string;
    recipientName?: string;
  };
  artisanId?: string; // If order is for a single artisan, or primary artisan
  // If multiple artisans, items array would need artisanId per item, or orders split.
  paymentDetails?: {
    paymentId: string;
    method: string; // e.g., 'Stripe', 'PayPal'
    status: string; // e.g., 'succeeded'
  };
  trackingNumber?: string;
  lastUpdatedAt?: string; // ISO date string
}

export interface OrderItem {
  productId: string;
  productName: string; // Denormalized
  productImage?: string; // Denormalized URL of primary image
  quantity: number;
  priceAtPurchase: number; // Price of the item at the time of order
  artisanId?: string; // If items can be from different artisans in one order
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

// For AuthContext
export interface AuthenticatedUser {
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  profileImageUrl?: string; // URL from Firebase Storage
  followedArtisans?: string[]; // Array of artisan IDs
  wishlist?: string[]; // Array of product IDs
  artisanProfileId?: string; // If role is 'seller', links to their document in `artisanProfiles`
}
