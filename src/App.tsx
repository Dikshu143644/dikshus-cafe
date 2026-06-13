import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import OpeningSlider, { CafeVistaLogo } from './components/OpeningSlider';

// Routing Views
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import MenuView from './components/MenuView';
import BookingView from './components/BookingView';
import CheckoutView from './components/CheckoutView';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import ManagerView from './components/ManagerView';
import AssistantView from './components/AssistantView';
import ContactView from './components/ContactView';

import { MenuItem, DiningType, UserRole, User } from './types';
import { MENU_ITEMS } from './data/mockData';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [diningType, setDiningType] = useState<DiningType>('dine-in');
  const [couponCode, setCouponCode] = useState<string>('');

  // Loaded database state lists
  const [menuList, setMenuList] = useState<MenuItem[]>(MENU_ITEMS);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);

  // Authenticated context
  const [user, setUser] = useState<User | null>(null);

  // Sync state data lists with the Express backend
  const syncServerData = async () => {
    try {
      const resMenu = await fetch('/api/menu');
      if (resMenu.ok) {
        const data = await resMenu.json();
        if (data.menuItems) setMenuList(data.menuItems);
      }

      const resBookings = await fetch('/api/bookings');
      if (resBookings.ok) {
        const data = await resBookings.json();
        if (data.bookings) setBookingsList(data.bookings);
      }

      const resOrders = await fetch('/api/orders');
      if (resOrders.ok) {
        const data = await resOrders.json();
        if (data.orders) setOrdersList(data.orders);
      }

      const resMessages = await fetch('/api/contact');
      if (resMessages.ok) {
        const data = await resMessages.json();
        if (data.messages) setMessagesList(data.messages);
      }
    } catch (e) {
      console.warn("Express synchronization offline/fallback active:", e);
    }
  };

  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.warn("Passive session validation error:", err);
      }
    };
    checkActiveSession();
    syncServerData();
  }, []);

  // Periodic poll to fetch updated preparing tickets or bookings status updates
  useEffect(() => {
    const timer = setInterval(() => {
      syncServerData();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Back to top scroll alignment upon navigation
  const handleNavigate = (page: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 450);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 900);
  };

  // Auth: Log In Action Handler
  const handleLogin = async (email: string, pass: string, role: UserRole) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass, role }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Verification failure');
    }

    setUser(result.user);
    return result;
  };

  // Auth: Registration Sign up Handler
  const handleSignup = async (name: string, email: string, phone: string, pass: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password: pass }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Sourcing registration rejection');
    }

    if (result.directLoggedIn && result.user) {
      setUser(result.user);
    }

    return result;
  };

  // Auth: Verify OTP Action Handler
  const handleVerifyOtp = async (email: string, otp: string) => {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'OTP key validation failed');
    }

    setUser(result.user);
    return result;
  };

  // Action Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn("Server session clear failed on logout:", e);
    }
    setUser(null);
    handleNavigate('home');
  };

  // Booking Scheduler Handler (Step 3 Submit)
  const handleAddBooking = async (bookingData: any) => {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Reservation scheduling failure');
    }

    // Refresh lists
    await syncServerData();
    return result;
  };

  // Secure checkout submit order Handler
  const handlePlaceOrder = async (orderPayload: any) => {
    // Stage 1: Post to calculate prices and register the unpaid order
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: orderPayload.customerName,
        customerEmail: orderPayload.customerEmail,
        customerPhone: orderPayload.customerPhone,
        items: orderPayload.items,
        diningType: orderPayload.diningType,
        couponCode: couponCode
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Order calculation/processing error');
    }

    // Stage 2: Perform cryptographic backend verification (simulate Razorpay test mode payment loop)
    const testPaymentId = 'pay_test_' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const verifResponse = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: result.order.id,
        razorpayOrderId: result.razorpayOrderId,
        razorpayPaymentId: testPaymentId,
        razorpaySignature: 'test_approved_signature' // Verified by the server using secure keys
      })
    });

    const verifResult = await verifResponse.json();
    if (!verifResponse.ok || !verifResult.success) {
      throw new Error(verifResult.message || 'Payment signature verification failed.');
    }

    // Accumulate user loyalty points securely from the updated user profile
    if (user) {
      setUser((prev: any) => prev ? {
        ...prev,
        loyaltyPoints: prev.loyaltyPoints + Math.floor(result.order.total * 10)
      } : null);
    }

    await syncServerData();
    return {
      success: true,
      order: {
        ...result.order,
        paymentStatus: 'paid',
        paymentId: testPaymentId
      }
    };
  };

  // Customer support inquiries handler
  const handleSendMessage = async (name: string, email: string, text: string) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message: text }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Message dispatch rejection');
    }

    await syncServerData();
    return result;
  };

  // AI assistant conversational post proxy
  const handleSendMessageToAi = async (prompt: string, history: any[]) => {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history, user }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Bot offline');
    }

    return { response: result.response, action: result.action };
  };

  // Toggle Favorite
  const handleToggleFavorite = (itemId: string) => {
    if (!user) {
      handleNavigate('login');
      return;
    }

    setUser((prev: any) => {
      if (!prev) return null;
      const isFav = prev.favorites.includes(itemId);
      const updatedFavs = isFav
        ? prev.favorites.filter((f: string) => f !== itemId)
        : [...prev.favorites, itemId];
      return { ...prev, favorites: updatedFavs };
    });
  };

  // Remove Favorite from dashboard view
  const handleRemoveFavorite = (itemId: string) => {
    setUser((prev: any) => {
      if (!prev) return null;
      return {
        ...prev,
        favorites: prev.favorites.filter((f: string) => f !== itemId)
      };
    });
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    // Visual trigger to slide drawer
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.item.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== id));
  };

  const handleNavigateToCheckout = (type: DiningType, coupon: string) => {
    setDiningType(type);
    setCouponCode(coupon);
    handleNavigate('checkout');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Manager: Update pending table reserve state
  const handleUpdateBookingStatus = async (id: string, status: 'approved' | 'cancelled') => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        await syncServerData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Manager: Update food preparation progress status
  const handleUpdateOrderStatus = async (id: string, status: 'preparing' | 'ready' | 'completed') => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        await syncServerData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const featuredItems = menuList.filter(item => item.isPopular).slice(0, 4);

  const PAGE_BACKGROUNDS: Record<string, string> = {
    home: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop',
    about: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=1600&auto=format&fit=crop',
    menu: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1600&auto=format&fit=crop',
    booking: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1600&auto=format&fit=crop',
    checkout: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1600&auto=format&fit=crop',
    login: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=1600&auto=format&fit=crop',
    dashboard: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1600&auto=format&fit=crop',
    manager: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop',
    assistant: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1600&auto=format&fit=crop',
    contact: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=1600&auto=format&fit=crop'
  };

  return (
    <div id="cafe-vista-root" className="min-h-screen bg-cafe-cream relative flex flex-col justify-between overflow-x-hidden">
      
      {/* Dynamic Atmospheric Page Backdrops */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {Object.entries(PAGE_BACKGROUNDS).map(([page, imgUrl]) => (
          <div
            key={page}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[1200ms] ease-in-out ${
              currentPage === page ? 'opacity-[0.58] scale-100 blur-[2px]' : 'opacity-0 scale-[1.05] blur-[12px]'
            }`}
            style={{
              backgroundImage: `url('${imgUrl}')`,
            }}
          />
        ))}
        {/* Soft elegant warm overlay tint over the background image to keep extreme contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FEFAF4]/40 via-[#FDFBF7]/48 to-[#FAF7F2]/55 pointer-events-none"></div>
      </div>
      
      {/* Cinematic Opening Slider Loader on first entry */}
      <OpeningSlider />

      {/* Premium Cinematic Split Transition for Active Tab Navigation */}
      <div 
        className={`fixed inset-0 z-[9998] flex flex-row transition-all duration-[450ms] ${
          isTransitioning ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none invisible delay-[450ms]'
        }`}
      >
        {/* Left sliding dark conservatory pane (slides left on all screens, hidden on mobile) */}
        <div 
          className={`hidden md:flex md:w-[42%] h-full bg-[#110F0D] relative items-center justify-center border-r border-[#D4AF37]/15 transition-transform duration-[450ms] ${
            isTransitioning ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            boxShadow: 'inset -20px 0 50px -10px rgba(0,0,0,0.8)',
            transitionTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)',
          }}
        >
          {/* Underlay Glasshouse Conservatory Interior Atmosphere */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-luminosity opacity-40 scale-[1.02]"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'contrast(1.15) brightness(0.6) sepia(0.2) saturate(0.8)',
            }}
          />

          {/* Ambient Dark Charcoal Shade overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/90 to-transparent pointer-events-none"></div>

          {/* ================= GOLD CRESCENT WIREFRAME CIRCLE VECTOR ================= */}
          <div 
            className="absolute -right-[230px] w-[460px] h-[460px] rounded-full border border-[#D4AF37]/30 pointer-events-none opacity-80 hidden md:block"
            style={{
              transform: 'translateY(-50%)',
              top: '50%',
              boxShadow: 'inset 0 0 40px rgba(212, 175, 55, 0.05)',
            }}
          >
            {/* Subtle concentric inner gold ring contour */}
            <div className="absolute inset-[15px] rounded-full border border-[#D4AF37]/15 opacity-60"></div>
            {/* Subtle outer radiating contour */}
            <div className="absolute -inset-[15px] rounded-full border border-[#D4AF37]/10 opacity-30"></div>
          </div>

          {/* ================= CINEMATIC SEAM GLOW RAY ================= */}
          <div className="absolute top-0 bottom-0 right-0 w-[1.5px] bg-gradient-to-b from-transparent via-[#E1C58F] to-transparent opacity-85 z-20 pointer-events-none flex flex-col items-center justify-end">
            {/* Bright glint right on the boundary crease */}
            <div className="absolute bottom-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_12px_4px_#FFF,0_0_20px_8px_#FFE082] translate-y-1/2 shrink-0"></div>
            {/* Extra trailing laser line bloom */}
            <div className="w-[6px] h-[180px] bg-gradient-to-t from-[#EAC352]/30 to-transparent blur-sm rounded-full absolute bottom-1/2"></div>
          </div>
        </div>

        {/* Right sliding cream pane (slides right, covers full screen on mobile) */}
        <div 
          className={`w-full md:w-[58%] h-full bg-[#FAF8F5] relative flex flex-col justify-center px-4 sm:px-16 md:px-24 py-6 sm:py-12 transition-transform duration-[450ms] ${
            isTransitioning ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)',
          }}
        >
          {/* Soft paper grain background overlay */}
          <div 
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }}
          />

          {/* Soft shadow vignette on right pane to add depth */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/[0.02] to-transparent pointer-events-none hidden md:block"></div>

          <div className="max-w-md w-full mx-auto space-y-4 sm:space-y-10 z-20 flex flex-col justify-between h-full md:h-auto text-center md:text-left">
            {/* spacer */}
            <div className="hidden md:block"></div>

            {/* ================= MINIMAL LUXURY LINE stamp / arch leaf BADGE ================= */}
            <div className="flex justify-center md:justify-start">
              <div 
                className="w-10 h-16 sm:w-14 sm:h-22 rounded-full border border-[#D4AF37]/50 flex items-center justify-center p-1 sm:p-2 relative shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(250,248,245,0.3) 100%)',
                }}
              >
                {/* Ultra fine inner dashed line */}
                <div className="absolute inset-[2px] sm:inset-[3px] rounded-full border border-[#D4AF37]/15"></div>

                {/* Gold brand logo icon */}
                <div className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center relative">
                  <CafeVistaLogo className="w-full h-full opacity-90 drop-shadow-[0_1px_2px_rgba(94,81,61,0.1)]" gold={true} />
                </div>
              </div>
            </div>

            {/* ================= CENTRAL LUXURIOUS SERIF HEADING ================= */}
            <div className="space-y-2 sm:space-y-4">
              <h1 
                className="font-serif text-3xl sm:text-5xl md:text-[5.4rem] font-light text-[#1A1816] tracking-[0.14em] leading-[1.05] drop-shadow-sm"
                style={{
                  fontFamily: `'Playfair Display', Georgia, serif`,
                  textRendering: 'optimizeLegibility',
                }}
              >
                DIKSHU'S CAFE
              </h1>

              <p 
                className="text-[10px] sm:text-[13px] text-[#8C7B6B] tracking-[0.25em] sm:translate-y-2 uppercase font-medium"
                style={{ fontFamily: `'Playfair Display', Georgia, serif` }}
              >
                London's Glasshouse Sanctuary
              </p>

              {/* Little separation leaf stamp or customized divider dot */}
              <div className="hidden sm:flex items-center justify-center md:justify-start gap-3 pt-3 opacity-80">
                <span className="h-[0.5px] w-6 bg-[#C4A484]/35"></span>
                <span className="text-[10px] text-[#A8947C] font-mono select-none">✦</span>
                <span className="h-[0.5px] w-6 bg-[#C4A484]/35"></span>
              </div>

              <p className="text-[8px] sm:text-[9px] tracking-[0.38em] uppercase font-bold text-[#A69380] font-mono pt-1">
                Established MMXVI • London
              </p>
            </div>

            {/* ================= HIGH-END MINIMAL CHROME LOADER TRACK ================= */}
            <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
              <div className="flex justify-between items-end text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.3em] font-bold text-[#7E7063] px-0.5">
                <span>Sourcing Sanctuary</span>
                <span className="animate-pulse">Loading...</span>
              </div>

              {/* Ultra-fine loading line */}
              <div className="w-full h-[1.5px] bg-[#E3DDD4] relative rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 h-full bg-[#1A1A1A] w-1/2 rounded-full"
                  style={{
                    animation: 'loadingSweepPulse 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                  }}
                />
              </div>
            </div>

            {/* spacer */}
            <div className="hidden md:block"></div>
          </div>
        </div>

        <style>{`
          @keyframes loadingSweepPulse {
            0% { transform: translateX(-110%); }
            100% { transform: translateX(210%); }
          }
        `}</style>
      </div>
      
      {/* Floating Glass Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        user={user}
        onLogout={handleLogout}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Slide-In Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onNavigateToCheckout={handleNavigateToCheckout}
      />

      {/* Main Core View Router */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            featuredItems={featuredItems}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'about' && <AboutView />}

        {currentPage === 'menu' && (
          <MenuView
            menuItems={menuList}
            onAddToCart={handleAddToCart}
            favorites={user ? user.favorites : []}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentPage === 'booking' && (
          <BookingView
            onAddBooking={handleAddBooking}
            userId={user?.id}
            userName={user?.name}
            userEmail={user?.email}
            userPhone={user?.phone}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutView
            cartItems={cart}
            diningType={diningType}
            couponCode={couponCode}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={handleNavigate}
            userId={user?.id}
            userName={user?.name}
            userEmail={user?.email}
            userPhone={user?.phone}
            onClearCart={handleClearCart}
          />
        )}

        {currentPage === 'login' && (
          <AuthView
            onLogin={handleLogin}
            onSignup={handleSignup}
            onVerifyOtp={handleVerifyOtp}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardView
            user={user}
            orders={ordersList}
            bookings={bookingsList}
            menuItems={menuList}
            onRemoveFavorite={handleRemoveFavorite}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'manager' && (
          <ManagerView
            user={user}
            bookings={bookingsList}
            orders={ordersList}
            messages={messagesList}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'assistant' && (
          <AssistantView 
            onSendMessage={handleSendMessageToAi} 
            onAddToCart={handleAddToCart}
            onAutoBook={handleAddBooking}
            featuredItems={menuList}
            user={user}
          />
        )}

        {currentPage === 'contact' && (
          <ContactView onSendMessage={handleSendMessage} />
        )}
      </main>

      {/* Page Elegant Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
