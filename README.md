
**LankaHands** is a modern web marketplace platform connecting artisans and buyers. Built with **Next.js**, **TypeScript**, and **Firebase**, it is cloud-ready and deployable on **Azure VM** with **Nginx** and **PM2**.

---

## 🌟 Key Features

### Marketplace Functionality
- Artisan registration, profile creation, and product listings.
- Buyers can browse products, follow artisans, add to cart, and place orders.
- Product reviews and ratings system.

### User Management
- Role-based access (buyer/seller)
- Secure authentication via Firebase
- Profile management and order history

### Seller Dashboard
- Analytics, product management, order tracking, notifications, and settings


### Backend & Data
- Firebase Firestore for data storage
- Firestore security rules for robust access control
- Server actions and service modules for business logic

### Deployment Ready
- Host on **Azure VM** with **Nginx** and **PM2**
- Supports HTTPS via DuckDNS domain or Let’s Encrypt SSL

---

## 🛠 Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS  
- **Backend:** Firebase (Firestore, Auth), Node.js  
- **Infrastructure:** Azure VM, Nginx, PM2, Terraform  
- **Other Tools:** Git, .env configuration files

---

## 🔒 Security & Best Practices
- Sensitive files and environment variables are excluded via `.gitignore`
- Firestore rules enforce strict access control
- HTTPS recommended for production deployments



