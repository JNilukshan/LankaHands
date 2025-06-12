
import type { Artisan, Product, User, Review, Order, OrderItem, ShippingSettings, StorePolicies } from '@/types';

// --- ARTISAN: Nimali Perera (Batik Artist) ---
const nimaliShippingSettings: ShippingSettings = {
  localRate: 5.00,
  localDeliveryTime: "3-5 business days",
  internationalRate: 25.00,
  internationalDeliveryTime: "7-21 business days",
  freeShippingLocalThreshold: 100,
  freeShippingInternationalThreshold: 200,
  processingTime: "1-2 business days",
};

const nimaliStorePolicies: StorePolicies = {
  returnPolicy: "Returns accepted within 14 days for defective items or if the product is not as described. Please contact us for a return authorization. Buyer pays return shipping unless the item is faulty.",
  exchangePolicy: "Exchanges are offered on a case-by-case basis for items of similar value, subject to availability. Please contact us to discuss.",
  cancellationPolicy: "Orders can be cancelled within 24 hours of placement, provided they have not yet been shipped.",
};

export const mockArtisanNimali: Artisan = {
  id: 'nimali-1',
  name: 'Nimali Perera',
  bio: "Nimali Perera is a celebrated Batik artist from the historic city of Kandy. With over 20 years of experience, Nimali draws inspiration from Sri Lanka's lush landscapes and rich cultural tapestry. Her work is characterized by intricate details, vibrant color palettes, and a fusion of traditional motifs with contemporary aesthetics. Each piece is a labor of love, meticulously handcrafted to bring a touch of Sri Lankan heritage into modern life. Nimali is passionate about sustainable practices, using eco-friendly dyes and materials in her creations. She also mentors young aspiring artists, helping to preserve and evolve the ancient art of Batik.",
  profileImageUrl: 'https://placehold.co/400x400.png', // Placeholder image
  speciality: 'Master Batik Artist',
  location: 'Kandy, Sri Lanka',
  followers: 1357,
  averageRating: 4.9,
  shippingSettings: nimaliShippingSettings,
  storePolicies: nimaliStorePolicies,
  products: [], // Will be populated later
};

// --- ARTISAN: Ravi Fernando (Wood Carver) ---
const raviShippingSettings: ShippingSettings = {
  localRate: 7.00,
  localDeliveryTime: "4-7 business days",
  internationalRate: 30.00,
  internationalDeliveryTime: "10-25 business days",
  processingTime: "2-4 business days (larger items may take longer)",
};

const raviStorePolicies: StorePolicies = {
  returnPolicy: "Returns for damaged items accepted within 7 days of receipt with photographic proof. No returns on custom commissioned pieces unless an error was made by the artisan.",
  exchangePolicy: "Exchanges are generally not offered due to the unique nature of hand-carved items. Please contact to discuss specific situations.",
  cancellationPolicy: "Cancellations accepted within 12 hours of order placement for standard items. Custom orders cannot be cancelled once work has begun.",
};

export const mockArtisanRavi: Artisan = {
  id: 'ravi-2',
  name: 'Ravi Fernando',
  bio: "Ravi Fernando is a master wood carver hailing from the coastal city of Galle. With generations of woodcraft in his family, Ravi's work is renowned for its intricate detailing and the lifelike quality he imparts to his sculptures. He primarily uses sustainably sourced local timbers like mahogany, teak, and ebony, transforming them into exquisite pieces that reflect Sri Lanka's rich biodiversity and cultural narratives. Ravi is dedicated to traditional carving techniques while also exploring contemporary forms.",
  profileImageUrl: 'https://placehold.co/400x400.png', // Placeholder image
  speciality: 'Wood Sculptor & Carver',
  location: 'Galle, Sri Lanka',
  followers: 975,
  averageRating: 4.7,
  shippingSettings: raviShippingSettings,
  storePolicies: raviStorePolicies,
  products: [], // Will be populated later
};

export const allMockArtisans: Artisan[] = [mockArtisanNimali, mockArtisanRavi];

// --- CUSTOMER: Chandana Silva ---
export const mockCustomerChandana: User = {
  id: 'chandana-c1',
  name: 'Chandana Silva',
  email: 'chandana.silva@example.com',
  profileImageUrl: 'https://placehold.co/128x128.png', // Placeholder image
  isSeller: false,
};

// --- REVIEWS (by Chandana Silva) ---
export const mockReviewsByChandana: Review[] = [
  {
    id: 'rev-c1-p1', userId: 'chandana-c1', userName: 'Chandana Silva', productId: 'prod-batik-saree-azure',
    rating: 5, comment: 'This Azure Dreams Batik Saree is absolutely breathtaking! The silk is luxurious, and the hand-painted motifs are even more vibrant in person. It drapes beautifully. Highly recommend Nimali\'s work!', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userAvatar: mockCustomerChandana.profileImageUrl,
  },
  {
    id: 'rev-c1-p3', userId: 'chandana-c1', userName: 'Chandana Silva', productId: 'prod-wood-elephant-majestic',
    rating: 4, comment: 'The Majestic Elephant sculpture is very well-carved and has a strong presence. There was a slight delay in shipping, but Ravi was communicative. A beautiful piece of art for our home.', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userAvatar: mockCustomerChandana.profileImageUrl,
  },
  {
    id: 'rev-c1-p2', userId: 'chandana-c1', userName: 'Chandana Silva', productId: 'prod-batik-wall-lotus',
    rating: 5, comment: 'I bought the Serene Lotus Batik Wall Hanging for my mother, and she adores it. The craftsmanship is exquisite, and it brings such a peaceful ambiance to her room. Thank you, Nimali!', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    userAvatar: mockCustomerChandana.profileImageUrl,
  }
];

// --- PRODUCTS ---
export const mockProductBatikSaree: Product = {
  id: 'prod-batik-saree-azure',
  name: 'Azure Dreams Batik Saree',
  description: 'Elegant pure silk saree with hand-painted Azure Dreams Batik motifs.',
  longDescription: "Crafted from the finest pure silk, this saree features intricate hand-painted Batik motifs that evoke the serene beauty of Sri Lankan coastlines and the depth of the azure sky. The flowing design and vibrant blues make it a perfect statement piece for any special occasion. Each saree is a unique work of art by Nimali Perera, reflecting hours of meticulous craftsmanship.",
  price: 135.00, category: 'Apparel',
  images: ['https://placehold.co/600x800.png', 'https://placehold.co/600x400.png', 'https://placehold.co/400x600.png'],
  artisanId: 'nimali-1',
  reviews: mockReviewsByChandana.filter(r => r.productId === 'prod-batik-saree-azure'),
  stock: 8, dimensions: "6 yards length, 45 inches width", materials: ["Pure Silk", "Eco-friendly Dyes"],
  artisan: mockArtisanNimali,
};

export const mockProductBatikWallHanging: Product = {
  id: 'prod-batik-wall-lotus',
  name: 'Serene Lotus Batik Wall Hanging',
  description: 'A stunning wall art piece capturing the serene beauty of a lotus flower in Batik.',
  longDescription: "Transform your space with this exquisite Batik wall hanging by Nimali Perera. Featuring a beautifully detailed lotus bloom, a symbol of purity and enlightenment, this piece is created using traditional Batik techniques on high-quality cotton fabric. The vibrant colors and intricate wax-resist patterns make it a captivating focal point for any room.",
  price: 95.00, category: 'Home Decor',
  images: ['https://placehold.co/600x600.png', 'https://placehold.co/400x400.png'],
  artisanId: 'nimali-1',
  reviews: mockReviewsByChandana.filter(r => r.productId === 'prod-batik-wall-lotus'),
  stock: 12, dimensions: "Approx. 70 x 70 cm", materials: ["Cotton Fabric", "Wax", "Natural Dyes"],
  artisan: mockArtisanNimali,
};

export const mockProductWoodenElephant: Product = {
  id: 'prod-wood-elephant-majestic',
  name: 'Majestic Mahogany Elephant Sculpture',
  description: 'Detailed hand-carved wooden elephant statue, a symbol of wisdom and strength.',
  longDescription: "Crafted from sustainably sourced mahogany by Ravi Fernando, this hand-carved elephant statue showcases incredible skill. The intricate details capture the majesty and gentle nature of this revered animal. A perfect addition to any home or office, bringing a touch of Sri Lankan artistry and symbolism.",
  price: 175.00, category: 'Decor',
  images: ['https://placehold.co/600x500.png', 'https://placehold.co/400x300.png'],
  artisanId: 'ravi-2',
  reviews: mockReviewsByChandana.filter(r => r.productId === 'prod-wood-elephant-majestic'),
  stock: 5, dimensions: "Approx. 10 inches tall, 12 inches length", materials: ["Mahogany Wood", "Natural Polish"],
  artisan: mockArtisanRavi,
};

export const mockProductWoodenMask: Product = {
  id: 'prod-wood-mask-cobra',
  name: 'Traditional Cobra Raksha Mask',
  description: 'Traditional Sri Lankan "Raksha" (demon) mask, hand-painted with vibrant colors.',
  longDescription: "This traditional Sri Lankan Raksha mask is hand-carved from light Kaduru wood by Ravi Fernando and meticulously hand-painted. Used in cultural dances and rituals, these masks are believed to ward off evil spirits. This piece, depicting the 'Naga Raksha' (Cobra Demon), is a vibrant example of Sri Lankan folk art and makes a striking decorative item or a unique cultural collectible.",
  price: 80.00, category: 'Decor',
  images: ['https://placehold.co/500x700.png', 'https://placehold.co/400x600.png'],
  artisanId: 'ravi-2',
  reviews: mockReviewsByChandana.filter(r => r.productId === 'prod-wood-mask-cobra'),
  stock: 0, // Intentionally out of stock
  dimensions: "Approx. 10 inches height", materials: ["Kaduru Wood", "Acrylic Paints"],
  artisan: mockArtisanRavi,
};

export const allMockProducts: Product[] = [mockProductBatikSaree, mockProductBatikWallHanging, mockProductWoodenElephant, mockProductWoodenMask];

// Populate artisan products arrays
mockArtisanNimali.products = allMockProducts.filter(p => p.artisanId === 'nimali-1');
mockArtisanRavi.products = allMockProducts.filter(p => p.artisanId === 'ravi-2');

// --- ORDERS (for Chandana Silva) ---
export const mockOrdersForChandana: Order[] = [
  {
    id: 'order-c1-1', userId: 'chandana-c1', customerName: 'Chandana Silva',
    items: [
      { productId: 'prod-batik-saree-azure', productName: mockProductBatikSaree.name, quantity: 1, price: mockProductBatikSaree.price, productImage: mockProductBatikSaree.images[0] },
      { productId: 'prod-wood-mask-cobra', productName: mockProductWoodenMask.name, quantity: 1, price: mockProductWoodenMask.price, productImage: mockProductWoodenMask.images[0] },
    ],
    totalAmount: mockProductBatikSaree.price + mockProductWoodenMask.price,
    orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Delivered', shippingAddress: '123, Flower Road, Colombo 07, Sri Lanka',
    // For simplicity, assume order is fulfilled by the first item's artisan, or handle multi-artisan orders differently
    artisan: mockArtisanNimali,
  },
  {
    id: 'order-c1-2', userId: 'chandana-c1', customerName: 'Chandana Silva',
    items: [
      { productId: 'prod-wood-elephant-majestic', productName: mockProductWoodenElephant.name, quantity: 1, price: mockProductWoodenElephant.price, productImage: mockProductWoodenElephant.images[0] },
    ],
    totalAmount: mockProductWoodenElephant.price,
    orderDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Shipped', shippingAddress: '45A, Marine Drive, Dehiwala, Sri Lanka',
    artisan: mockArtisanRavi,
  },
];

// --- WISHLIST (for Chandana Silva) ---
export const mockWishlistForChandana: Product[] = [mockProductBatikWallHanging, mockProductWoodenMask];

// --- HELPER FUNCTIONS ---
export const getMockArtisanById = async (id: string): Promise<Artisan | null> => {
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async
  return allMockArtisans.find(a => a.id === id) || null;
};

export const getMockProductById = async (id: string): Promise<Product | null> => {
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async
  const product = allMockProducts.find(p => p.id === id);
  if (product) {
    // Ensure artisan details are attached if not already
    if (!product.artisan) {
      product.artisan = allMockArtisans.find(a => a.id === product.artisanId);
    }
    // Ensure reviews are attached if not already
    if(!product.reviews || product.reviews.length === 0) {
        product.reviews = mockReviewsByChandana.filter(r => r.productId === product.id);
    }
  }
  return product || null;
};

export const getMockProductsByArtisanId = async (artisanId: string): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return allMockProducts.filter(p => p.artisanId === artisanId).map(p => {
    // Ensure artisan details are attached
    if (!p.artisan) {
      p.artisan = allMockArtisans.find(a => a.id === p.artisanId);
    }
    return p;
  });
};

export const getMockOrdersByCustomerId = async (customerId: string): Promise<Order[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  if (customerId === mockCustomerChandana.id) {
    return mockOrdersForChandana;
  }
  return [];
};

export const getMockWishlistByCustomerId = async (customerId: string): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
   if (customerId === mockCustomerChandana.id) {
    return mockWishlistForChandana.map(p => {
      if(!p.artisan) {
        p.artisan = allMockArtisans.find(a => a.id === p.artisanId);
      }
      return p;
    });
  }
  return [];
};

export const getMockAllProducts = async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return allMockProducts.map(p => {
         if (!p.artisan) {
            p.artisan = allMockArtisans.find(a => a.id === p.artisanId);
        }
        if(!p.reviews || p.reviews.length === 0) {
            p.reviews = mockReviewsByChandana.filter(r => r.productId === p.id);
        }
        return p;
    });
};

export const getMockAllArtisans = async (): Promise<Artisan[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return allMockArtisans;
};

// For Seller Dashboard - assuming it's for Nimali Perera
export const getMockSellerStatsForNimali = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const nimaliProducts = allMockProducts.filter(p => p.artisanId === mockArtisanNimali.id);
    const nimaliOrders = mockOrdersForChandana.filter(order => order.items.some(item => nimaliProducts.find(p => p.id === item.productId)));
    
    const totalSales = nimaliOrders.reduce((sum, order) => {
        const orderSales = order.items.reduce((itemSum, item) => {
            if (nimaliProducts.find(p => p.id === item.productId)) {
                return itemSum + item.price * item.quantity;
            }
            return itemSum;
        }, 0);
        return sum + orderSales;
    }, 0);

    const totalReviews = nimaliProducts.reduce((sum, p) => sum + (p.reviews?.length || 0), 0);
    const pendingOrders = nimaliOrders.filter(o => o.status === 'Pending').length;

    return {
        totalSales: totalSales,
        averageRating: mockArtisanNimali.averageRating,
        followers: mockArtisanNimali.followers,
        totalReviews: totalReviews,
        productsCount: nimaliProducts.length,
        pendingOrders: pendingOrders,
    };
}

export const getMockRecentOrdersForNimali = async (): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const nimaliProducts = allMockProducts.filter(p => p.artisanId === mockArtisanNimali.id);
    return mockOrdersForChandana
        .filter(order => order.items.some(item => nimaliProducts.find(p => p.id === item.productId)))
        .sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0,3); // Return top 3 recent
}

export const getMockAllOrdersForNimali = async (): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const nimaliProducts = allMockProducts.filter(p => p.artisanId === mockArtisanNimali.id);
    return mockOrdersForChandana
        .filter(order => order.items.some(item => nimaliProducts.find(p => p.id === item.productId)))
        .sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
}

export const getMockAllReviewsForNimali = async (): Promise<Review[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const nimaliProductIds = allMockProducts.filter(p => p.artisanId === mockArtisanNimali.id).map(p => p.id);
    return mockReviewsByChandana.filter(r => nimaliProductIds.includes(r.productId)).map(r => {
        const product = allMockProducts.find(p => p.id === r.productId);
        return {...r, productName: product?.name || "Unknown Product", productImageUrl: product?.images[0] };
    });
}


    