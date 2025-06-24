
'use server';

import type { Order, OrderItem, CartItem, Artisan, AuthenticatedUser } from '@/types';
import { adminDb } from '@/lib/firebaseConfig';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notificationService';

/**
 * Creates one or more orders from a user's cart.
 * It groups items by artisan and creates a separate order for each artisan.
 * @param cartItems The items from the user's cart.
 * @param user The authenticated user placing the order.
 * @returns A promise that resolves to an object with success status and a message.
 */
export async function createOrdersFromCart(cartItems: CartItem[], user: AuthenticatedUser) {
    if (!user || !cartItems || cartItems.length === 0) {
        return { success: false, message: 'Invalid user or cart data.' };
    }

    // Group cart items by artisanId
    const itemsByArtisan = cartItems.reduce<Record<string, CartItem[]>>((acc, item) => {
        const artisanId = item.artisanId || 'unknown';
        if (!acc[artisanId]) {
            acc[artisanId] = [];
        }
        acc[artisanId].push(item);
        return acc;
    }, {});

    const batch = adminDb.batch();
    const createdOrderIds: string[] = [];

    try {
        for (const artisanId in itemsByArtisan) {
            const artisanItems = itemsByArtisan[artisanId];
            const totalAmount = artisanItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const orderRef = adminDb.collection('orders').doc();
            createdOrderIds.push(orderRef.id);
            
            const orderData: Omit<Order, 'id' | 'items'> = {
                userId: user.id,
                customerName: user.name,
                artisanId: artisanId === 'unknown' ? undefined : artisanId,
                totalAmount: totalAmount,
                orderDate: new Date().toISOString(), // Use ISO string for client/server consistency
                status: 'Pending',
                grandTotal: totalAmount, // Simplified for now
                shippingAddress: "123 Craft Lane, Colombo, 00700, Sri Lanka", // Mock shipping address as string
            };
            
            const orderItems: OrderItem[] = artisanItems.map(cartItem => ({
                productId: cartItem.id,
                productName: cartItem.name,
                productImage: cartItem.image,
                quantity: cartItem.quantity,
                priceAtPurchase: cartItem.price,
                artisanId: cartItem.artisanId,
            }));
            
            const finalOrderDoc = {
                ...orderData,
                orderDate: FieldValue.serverTimestamp(), // Use server timestamp for accuracy
                items: orderItems,
            };

            batch.set(orderRef, finalOrderDoc);
            
            // Create a notification for the seller
            if (artisanId !== 'unknown') {
                 const notificationPayload = {
                    type: 'new_order' as const,
                    title: `New Order #${orderRef.id.substring(0,6)} Received`,
                    description: `${artisanItems.length} item(s) ordered by ${user.name}.`,
                    artisanId: artisanId,
                    sender: user.name,
                    link: `/dashboard/seller/orders` 
                };
                await createNotification(notificationPayload);
            }
        }
        
        await batch.commit();

        revalidatePath('/profile');
        revalidatePath('/dashboard/seller');
        revalidatePath('/dashboard/seller/orders');
        
        return { success: true, message: 'Your order has been placed successfully!', orderIds: createdOrderIds };

    } catch (error) {
        console.error("Error creating orders:", error);
        return { success: false, message: 'Failed to place your order. Please try again.' };
    }
}

export async function getOrdersByCustomerId(customerId: string): Promise<Order[]> {
  if (!customerId) return [];
  try {
    const ordersSnapshot = await adminDb.collection('orders')
      .where('userId', '==', customerId)
      .orderBy('orderDate', 'desc')
      .get();
      
    if (ordersSnapshot.empty) return [];
    
    const orders: Order[] = ordersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        orderDate: data.orderDate?.toDate().toISOString() || new Date().toISOString(),
        items: data.items || [], // Items are stored directly on the order document
      } as Order;
    });
    
    return orders;
  } catch (error) {
    console.error(`Error fetching orders for customer ID ${customerId}:`, error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
    if (!orderId) return null;
    try {
        const orderDoc = await adminDb.collection('orders').doc(orderId).get();
        if (!orderDoc.exists) return null;

        const data = orderDoc.data();
        if (!data) return null;

        let artisan: Artisan | undefined = undefined;
        if (data.artisanId) {
            const artisanDoc = await adminDb.collection('artisanProfiles').doc(data.artisanId).get();
            if (artisanDoc.exists) {
                artisan = { id: artisanDoc.id, ...artisanDoc.data() } as Artisan;
            }
        }

        return {
            id: orderDoc.id,
            ...data,
            orderDate: data.orderDate?.toDate().toISOString() || new Date().toISOString(),
            items: data.items || [],
            artisan: artisan,
        } as Order;

    } catch (error) {
        console.error(`Error fetching order with ID ${orderId}:`, error);
        return null;
    }
}

export async function getOrdersByArtisanId(artisanId: string): Promise<Order[]> {
    if (!artisanId) return [];
    try {
        const ordersSnapshot = await adminDb.collection('orders')
            .where('artisanId', '==', artisanId)
            .orderBy('orderDate', 'desc')
            .get();

        if (ordersSnapshot.empty) return [];

        const orders: Order[] = ordersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                orderDate: data.orderDate?.toDate().toISOString() || new Date().toISOString(),
                items: data.items || [],
            } as Order;
        });
        
        return orders;
    } catch (error) {
        console.error(`Error fetching orders for artisan ID ${artisanId}:`, error);
        return [];
    }
}
