/**
 * Shared Type Definitions for Cafe Vista Ecosystem
 */

export type UserRole = 'customer' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isOtpVerified: boolean;
  loyaltyPoints: number;
  favorites: string[]; // List of MenuItem IDs
}

export type MenuCategory = 'espresso' | 'signature' | 'pastries' | 'brunch' | 'beverages';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  isVegan: boolean;
  isGlutenFree: boolean;
  isPopular?: boolean;
  rating: number;
  ingredients: string[];
  calorieCount: number;
}

export type BookingStatus = 'pending' | 'approved' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guestsCount: number;
  tablePreference: 'window' | 'alcove' | 'garden' | 'bar' | 'standard';
  occasion?: string;
  specialNotes?: string;
  status: BookingStatus;
  calendarEventId?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type DiningType = 'dine-in' | 'pickup';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  diningType: DiningType;
  status: OrderStatus;
  paymentStatus: 'unpaid' | 'processing' | 'paid' | 'failed';
  paymentId?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minSpend: number;
  description: string;
}
