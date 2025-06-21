
'use server';

import type { Order, OrderItem, Artisan } from '@/types';
import { adminDb } from '@/lib/firebaseConfig';

export async function getOrdersByCustomerId(customerId: string): Promise<Order[]> {
  if (!customerId) return [];
  try {
    const ordersSnapshot = await adminDb.collection('orders')
      .where('userId', '==', customerId)
      .orderBy('orderDate', 'desc')
      .get();
      
    if (ordersSnapshot.empty) return [];
    
    const orders: Order[] = await Promise.all(ordersSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      // Assuming items are a subcollection. If not, this needs adjustment.
      const itemsSnapshot = await doc.ref.collection('items').get();
      const items: OrderItem[] = itemsSnapshot.docs.map(itemDoc => itemDoc.data() as OrderItem);
      
      return {
        id: doc.id,
        ...data,
        orderDate: data.orderDate?.toDate().toISOString() || new Date().toISOString(),
        items: items,
      } as Order;
    }));
    
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

        const itemsSnapshot = await orderDoc.ref.collection('items').get();
        const items: OrderItem[] = itemsSnapshot.docs.map(itemDoc => itemDoc.data() as OrderItem);

        let artisan: Artisan | undefined = undefined;
        if (data.artisanId) {
            const artisanDoc = await adminDb.collection('artisanProfiles').doc(data.artisanId).get();
            if (artisanDoc.exists) {
                artisan = { id: artisanDoc.id, ...artisanDoc.data() } as Artisan;
            }
        }
        
        const shippingAddressString = typeof data.shippingAddress === 'object' 
            ? `${data.shippingAddress.recipientName || ''}, ${data.shippingAddress.street}, ${data.shippingAddress.city}, ${data.shippingAddress.postalCode}, ${data.shippingAddress.country}`.replace(/^, /,'')
            : data.shippingAddress;


        return {
            id: orderDoc.id,
            ...data,
            orderDate: data.orderDate?.toDate().toISOString() || new Date().toISOString(),
            items: items,
            artisan: artisan,
            shippingAddress: shippingAddressString, // Flattened for display
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

        const orders: Order[] = await Promise.all(ordersSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const itemsSnapshot = await doc.ref.collection('items').get();
            const items: OrderItem[] = itemsSnapshot.docs.map(itemDoc => itemDoc.data() as OrderItem);
            
            return {
                id: doc.id,
                ...data,
                orderDate: data.orderDate?.toDate().toISOString() || new Date().toISOString(),
                items: items,
            } as Order;
        }));
        
        return orders;
    } catch (error) {
        console.error(`Error fetching orders for artisan ID ${artisanId}:`, error);
        return [];
    }
}
