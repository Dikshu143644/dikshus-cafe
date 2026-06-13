import { MenuItem, Review, Coupon } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Gilded Espresso Crema',
    description: 'Double shot of our house medium-roast single-origin premium beans, topped with a micro-sprinkle of food-grade edible gold dust.',
    price: 6.50,
    category: 'espresso',
    image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop',
    isVegan: true,
    isGlutenFree: true,
    isPopular: true,
    rating: 4.9,
    ingredients: ['Single-origin Espresso', '24k Gold Flakes'],
    calorieCount: 5
  },
  {
    id: 'm2',
    name: 'Velvet Lavender Honey Latte',
    description: 'Freshly pulled espresso with organic local honey, natural lavender essence syrup, and smooth oat milk micro-foam.',
    price: 7.25,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop',
    isVegan: false,
    isGlutenFree: true,
    isPopular: true,
    rating: 4.8,
    ingredients: ['Espresso', 'Oat Milk', 'Organic Honey', 'Natural Lavender'],
    calorieCount: 180
  },
  {
    id: 'm3',
    name: 'Smoked Salmon Sourdough',
    description: 'Heirloom sourdough toasted, layered with whipped herb cream cheese, premium cold-smoked salmon, capers, pickled red onions, and fresh dill.',
    price: 16.00,
    category: 'brunch',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop',
    isVegan: false,
    isGlutenFree: false,
    isPopular: true,
    rating: 4.9,
    ingredients: ['Artisanal Sourdough', 'Cold-Smoked Salmon', 'Whipped Herb Cream Cheese', 'Capers', 'Pickled Red Onions'],
    calorieCount: 420
  },
  {
    id: 'm4',
    name: 'Pistachio Glazed Croissant',
    description: 'Twice-baked Parisian laminated butter pastry filled with organic Sicilian pistachio frangipane paste, glazed and encrusted with crushed premium pistachios.',
    price: 8.50,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
    isVegan: false,
    isGlutenFree: false,
    isPopular: true,
    rating: 4.7,
    ingredients: ['French Laminated Dough', 'Pistachio Meal', 'Brown Butter', 'Raw Sugar Glaze'],
    calorieCount: 380
  },
  {
    id: 'm5',
    name: 'Truffle Wild Mushroom Crepe',
    description: 'Savory buckwheat thin crepe stuffed with pan-seared oyster and chanterelle mushroom medley, baby spinach, organic gruyère cheese, and a drizzle of rich white truffle oil.',
    price: 18.50,
    category: 'brunch',
    image: 'https://images.unsplash.com/photo-1621303837474-61047dbd8b63?q=80&w=600&auto=format&fit=crop',
    isVegan: false,
    isGlutenFree: true,
    rating: 4.6,
    ingredients: ['Buckwheat Flour', 'Oyster Mushrooms', 'Chanterelles', 'Gruyère Cheese', 'White Truffle Oil'],
    calorieCount: 340
  },
  {
    id: 'm6',
    name: 'Smoked Vanilla Cardamom Brew',
    description: 'Our signature slow-steeped 18-hour cold brew infused with whole smoked Madagascar vanilla pods and crushed wild cardamom seeds.',
    price: 6.75,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop',
    isVegan: true,
    isGlutenFree: true,
    isPopular: false,
    rating: 4.5,
    ingredients: ['18h Cold Brew Coffee', 'Madagascar Vanilla Pod', 'Wild Egyptian Cardamom'],
    calorieCount: 15
  },
  {
    id: 'm7',
    name: 'Rosewater Raspberry Éclair',
    description: 'Crispy choux pastry shell filled with rich organic raspberry and pure Bulgarian rosewater pastry cream, topped with white chocolate fondant and candied rose petals.',
    price: 7.50,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?q=80&w=600&auto=format&fit=crop',
    isVegan: false,
    isGlutenFree: false,
    rating: 4.8,
    ingredients: ['Pâte à Choux', 'Raspberries', 'Damask Rosewater', 'Cream', 'White Chocolate'],
    calorieCount: 290
  },
  {
    id: 'm8',
    name: 'Golden Turmeric Silk Latte',
    description: 'Sun-dried premium turmeric, shaved baby ginger, cracked black pepper accent, organic cinnamon, steamed with warm homemade almond milk.',
    price: 7.00,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1606131731446-5518d873014c?q=80&w=600&auto=format&fit=crop',
    isVegan: true,
    isGlutenFree: true,
    rating: 4.7,
    ingredients: ['Organic Turmeric Root', 'Almond Milk', 'Ginger Extract', 'Black Pepper', 'Cinnamon'],
    calorieCount: 110
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    customerName: 'Aurelia Vance',
    rating: 5,
    comment: 'The Velvet Lavender Latte here is pure artistry. The quiet, ambient smoke theme and subtle organic coffee scent make this cafe my absolute sanctuary in the heart of the city.',
    date: '3 days ago'
  },
  {
    id: 'r2',
    customerName: 'Marcus Sterling',
    rating: 5,
    comment: 'The smoked salmon toast sourdough is exceptionally crisp and delicious. Service is quick, and the digital reservation worked like charm. A flawless human touch.',
    date: '1 week ago'
  },
  {
    id: 'r3',
    customerName: 'Elena Rostova',
    rating: 4.8,
    comment: 'Beautiful space with an amazing editorial layout. I love doing focus work here. The Pistachio Glazed Croissant is a bite of sweet buttery heaven!',
    date: '2 weeks ago'
  }
];

export const COUPONS: Coupon[] = [
  { code: 'VISTA20', discountPercentage: 20, minSpend: 25.0, description: '20% Off for orders over $25!' },
  { code: 'WELCOME10', discountPercentage: 10, minSpend: 10.0, description: 'New guest welcome 10% discount.' },
  { code: 'LATTEPOINTS', discountPercentage: 15, minSpend: 0.0, description: 'Loyalty member reward 15% discount.' }
];
