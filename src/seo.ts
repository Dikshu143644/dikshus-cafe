export const SITE_URL = 'https://dikshus-cafe.onrender.com';

export const seoPages: Record<string, { path: string; title: string; description: string; index: boolean }> = {
  home: {
    path: '/',
    title: "Dikshu's Cafe | London Glasshouse Coffee Sanctuary",
    description: "Reserve tables, order artisan coffee and pastries, and explore Dikshu's Cafe, a London glasshouse sanctuary for specialty brews and slow hospitality.",
    index: true
  },
  menu: {
    path: '/menu',
    title: "Menu | Dikshu's Cafe London Artisan Coffee",
    description: "Browse specialty espresso, signature lattes, pastries, brunch plates, and cafe drinks from Dikshu's Cafe in London.",
    index: true
  },
  booking: {
    path: '/reserve',
    title: "Reserve a Table | Dikshu's Cafe London",
    description: "Book a table at Dikshu's Cafe, London's glasshouse cafe for specialty coffee, brunch, pastries, and calm hospitality.",
    index: true
  },
  about: {
    path: '/about',
    title: "Our Story | Dikshu's Cafe",
    description: "Learn about Dikshu's Cafe, its artisan coffee values, glasshouse atmosphere, and slow-living hospitality in London.",
    index: true
  },
  contact: {
    path: '/contact',
    title: "Contact | Dikshu's Cafe London",
    description: "Contact Dikshu's Cafe in London for reservations, menu questions, private visits, and customer support.",
    index: true
  },
  assistant: {
    path: '/assistant',
    title: "AI Concierge | Dikshu's Cafe",
    description: "Ask Dikshu's Cafe concierge for menu suggestions, booking help, opening hours, and order guidance.",
    index: false
  },
  login: {
    path: '/login',
    title: "Sign In | Dikshu's Cafe",
    description: "Sign in to your Dikshu's Cafe account.",
    index: false
  },
  dashboard: {
    path: '/dashboard',
    title: "Customer Dashboard | Dikshu's Cafe",
    description: "Review your Dikshu's Cafe orders, reservations, and rewards.",
    index: false
  },
  manager: {
    path: '/manager',
    title: "Operations Console | Dikshu's Cafe",
    description: "Manage Dikshu's Cafe orders, bookings, and support requests.",
    index: false
  },
  checkout: {
    path: '/checkout',
    title: "Checkout | Dikshu's Cafe",
    description: "Complete your Dikshu's Cafe order.",
    index: false
  }
};

export const getPathForPage = (page: string) => seoPages[page]?.path || '/';

export const getPageFromPath = (path: string) => {
  const normalizedPath = path.replace(/\/+$/, '') || '/';
  const match = Object.entries(seoPages).find(([, config]) => config.path === normalizedPath);
  return match ? match[0] : 'home';
};

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '/' : path}`;
