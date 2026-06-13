import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, doublePrecision } from 'drizzle-orm/pg-core';

// 1. Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('CUSTOMER').notNull(), // 'CUSTOMER' or 'ADMIN'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Menu Items Table
export const menuItems = pgTable('menu_items', {
  id: text('id').primaryKey(), // Custom string ID (e.g. 'espresso-gilded')
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: doublePrecision('price').notNull(), // Floating point price
  category: text('category').notNull(), // 'espresso' | 'signature' | 'pastries' | 'brunch' | 'beverages'
  image: text('image').notNull(),
  isVegan: boolean('is_vegan').default(false).notNull(),
  isGlutenFree: boolean('is_gluten_free').default(false).notNull(),
  rating: doublePrecision('rating').default(5.0).notNull(),
  calories: integer('calories').default(0).notNull(),
});

// 3. Addresses Table
export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  street: text('street').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  country: text('country').default('India').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
});

// 4. Cart Items Table (Real server-side shopping cart persistence)
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  menuItemId: text('menu_item_id')
    .references(() => menuItems.id, { onDelete: 'cascade' })
    .notNull(),
  quantity: integer('quantity').notNull(),
});

// 5. Orders Table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'set null' }),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  subtotal: doublePrecision('subtotal').notNull(),
  discount: doublePrecision('discount').default(0).notNull(),
  total: doublePrecision('total').notNull(),
  diningType: text('dining_type').default('pickup').notNull(), // 'dine-in' | 'pickup'
  status: text('status').default('pending').notNull(), // 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  paymentStatus: text('payment_status').default('unpaid').notNull(), // 'unpaid' | 'processing' | 'paid' | 'failed'
  razorpayOrderId: text('razorpay_order_id'), // razorpay order ID reference
  razorpayPaymentId: text('razorpay_payment_id'), // verified razorpay payment ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Order Items Table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  menuItemId: text('menu_item_id')
    .references(() => menuItems.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  price: doublePrecision('price').notNull(),
  quantity: integer('quantity').notNull(),
});

// 7. Bookings Table (For Table Reservations)
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'set null' }),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  time: text('time').notNull(), // HH:MM
  guestsCount: integer('guests_count').notNull(),
  tablePreference: text('table_preference').default('standard').notNull(), // 'window' | 'alcove' | 'garden' | 'bar' | 'standard'
  occasion: text('occasion'),
  specialNotes: text('special_notes'),
  status: text('status').default('pending').notNull(), // 'pending' | 'approved' | 'completed' | 'cancelled'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  cartItems: many(cartItems),
  orders: many(orders),
  bookings: many(bookings),
}));

export const menuItemsRelations = relations(menuItems, ({ many }) => ({
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  menuItem: one(menuItems, {
    fields: [cartItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));
