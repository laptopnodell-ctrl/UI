import { img } from "./vino-images";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  rating: number;
  reviews: number;
  image: string;
  category: CategoryKey;
  sub: string;
  veg: boolean;
  badge?: string;
  unavailable?: boolean;
  variants?: { label: string; delta: number }[];
  addons?: { label: string; price: number; required?: boolean }[];
};

export type CategoryKey = "restaurant" | "bakery" | "tea";

export const categories: {
  key: CategoryKey;
  title: string;
  subtitle: string;
  image: string;
  subs: string[];
}[] = [
  {
    key: "restaurant",
    title: "Restaurant",
    subtitle: "Biryani, meals & curries",
    image: img.catRestaurant,
    subs: ["Biryani", "Meals", "Rice", "Noodles", "Chicken", "Fish", "Veg", "Snacks"],
  },
  {
    key: "bakery",
    title: "Bakery",
    subtitle: "Freshly baked favourites",
    image: img.catBakery,
    subs: ["Cakes", "Pastries", "Puffs", "Bread", "Cookies", "Sweets", "Snacks"],
  },
  {
    key: "tea",
    title: "Tea & Beverages",
    subtitle: "Brewed fresh, served with love",
    image: img.catTea,
    subs: ["Tea", "Coffee", "Fresh Juice", "Milkshakes", "Cold Drinks", "Snacks"],
  },
];

const defaultAddons = [
  { label: "Extra Raita", price: 20 },
  { label: "Boiled Egg", price: 25 },
  { label: "Extra Gravy", price: 30 },
];

export const products: Product[] = [
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    description: "Long-grain basmati, slow-dum chicken, house biryani masala.",
    price: 180,
    mrp: 220,
    rating: 4.7,
    reviews: 1240,
    image: img.chickenBiryaniHero,
    category: "restaurant",
    sub: "Biryani",
    veg: false,
    badge: "Bestseller",
    variants: [
      { label: "Half", delta: 0 },
      { label: "Full", delta: 90 },
      { label: "Family Pack", delta: 240 },
    ],
    addons: defaultAddons,
  },
  {
    id: "hyderabadi-biryani",
    name: "Hyderabadi Chicken Biryani",
    description: "Dum-cooked with saffron, fried onions and mint.",
    price: 210,
    rating: 4.6,
    reviews: 860,
    image: img.hyderabadiBiryani,
    category: "restaurant",
    sub: "Biryani",
    veg: false,
    badge: "Chef's Special",
    addons: defaultAddons,
  },
  {
    id: "veg-meals",
    name: "Special Veg Meals",
    description: "Rice, sambar, three sides, pickle, papad and curd.",
    price: 130,
    rating: 4.4,
    reviews: 420,
    image: img.vegMeals,
    category: "restaurant",
    sub: "Meals",
    veg: true,
  },
  {
    id: "murgh-makhani",
    name: "Murgh Makhani",
    description: "Butter chicken in a silky tomato-cashew gravy.",
    price: 260,
    rating: 4.8,
    reviews: 970,
    image: img.murghMakhani,
    category: "restaurant",
    sub: "Chicken",
    veg: false,
    badge: "Popular",
  },
  {
    id: "chicken-65",
    name: "Chicken 65",
    description: "Crispy fried chicken tossed with curry leaves and chilli.",
    price: 190,
    rating: 4.5,
    reviews: 610,
    image: img.chicken65,
    category: "restaurant",
    sub: "Snacks",
    veg: false,
  },
  {
    id: "masala-dosa",
    name: "Crispy Masala Dosa",
    description: "Golden dosa with spiced potato masala, chutney and sambar.",
    price: 90,
    rating: 4.3,
    reviews: 300,
    image: img.masalaDosa,
    category: "restaurant",
    sub: "Snacks",
    veg: true,
  },
  {
    id: "garlic-naan",
    name: "Butter Garlic Naan",
    description: "Tandoor-baked naan brushed with garlic butter.",
    price: 60,
    rating: 4.6,
    reviews: 240,
    image: img.garlicNaan,
    category: "restaurant",
    sub: "Meals",
    veg: true,
  },
  {
    id: "paneer-butter-masala",
    name: "Paneer Butter Masala",
    description: "Soft paneer cubes in a rich buttery tomato gravy.",
    price: 220,
    rating: 4.5,
    reviews: 510,
    image: img.paneerNaan,
    category: "restaurant",
    sub: "Veg",
    veg: true,
  },
  {
    id: "fish-curry-meals",
    name: "Kerala Fish Curry Meals",
    description: "Coastal fish curry with rice and thoran.",
    price: 240,
    rating: 4.6,
    reviews: 180,
    image: img.risotto,
    category: "restaurant",
    sub: "Fish",
    veg: false,
    unavailable: true,
  },
  {
    id: "black-forest-cake",
    name: "Black Forest Cake",
    description: "Chocolate sponge, whipped cream and cherry compote.",
    price: 450,
    mrp: 520,
    rating: 4.7,
    reviews: 320,
    image: img.freshCreamCake,
    category: "bakery",
    sub: "Cakes",
    veg: true,
    badge: "Bestseller",
    variants: [
      { label: "500 g", delta: 0 },
      { label: "1 kg", delta: 350 },
    ],
  },
  {
    id: "fresh-cream-cake",
    name: "Fresh Cream Cake",
    description: "Airy vanilla sponge layered with fresh cream and berries.",
    price: 420,
    rating: 4.6,
    reviews: 210,
    image: img.freshCreamCake,
    category: "bakery",
    sub: "Cakes",
    veg: true,
  },
  {
    id: "chocolate-pastry",
    name: "Chocolate Pastry",
    description: "Fudgy chocolate pastry with ganache glaze.",
    price: 70,
    rating: 4.5,
    reviews: 190,
    image: img.onboard2,
    category: "bakery",
    sub: "Pastries",
    veg: true,
  },
  {
    id: "chicken-puff",
    name: "Chicken Puff",
    description: "Flaky puff pastry with spiced chicken filling.",
    price: 35,
    rating: 4.4,
    reviews: 410,
    image: img.onboard2,
    category: "bakery",
    sub: "Puffs",
    veg: false,
    badge: "Hot",
  },
  {
    id: "veg-puff",
    name: "Veg Puff",
    description: "Classic tea-time puff with masala vegetable filling.",
    price: 25,
    rating: 4.3,
    reviews: 380,
    image: img.onboard2,
    category: "bakery",
    sub: "Puffs",
    veg: true,
  },
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    description: "Twenty-seven buttery layers, baked every morning.",
    price: 85,
    rating: 4.7,
    reviews: 150,
    image: img.onboard2,
    category: "bakery",
    sub: "Bread",
    veg: true,
  },
  {
    id: "milk-bread",
    name: "Milk Bread",
    description: "Soft milk loaf, freshly sliced.",
    price: 45,
    rating: 4.2,
    reviews: 120,
    image: img.burrataToast,
    category: "bakery",
    sub: "Bread",
    veg: true,
  },
  {
    id: "butter-cookies",
    name: "Butter Cookies",
    description: "Crumbly butter cookies in a 250 g pack.",
    price: 120,
    rating: 4.4,
    reviews: 95,
    image: img.burrataToast,
    category: "bakery",
    sub: "Cookies",
    veg: true,
  },
  {
    id: "classic-milk-tea",
    name: "Classic Milk Tea",
    description: "Strong Assam brew with creamy milk, our house pour.",
    price: 20,
    rating: 4.6,
    reviews: 880,
    image: img.onboard3,
    category: "tea",
    sub: "Tea",
    veg: true,
    badge: "Bestseller",
    variants: [
      { label: "Regular", delta: 0 },
      { label: "Large", delta: 10 },
    ],
  },
  {
    id: "masala-chai",
    name: "Masala Chai",
    description: "Ginger, cardamom and clove simmered with tea and milk.",
    price: 25,
    rating: 4.7,
    reviews: 640,
    image: img.onboard3,
    category: "tea",
    sub: "Tea",
    veg: true,
  },
  {
    id: "lime-tea",
    name: "Lime Tea",
    description: "Light black tea with fresh lime and honey.",
    price: 25,
    rating: 4.3,
    reviews: 140,
    image: img.onboard3,
    category: "tea",
    sub: "Tea",
    veg: true,
  },
  {
    id: "black-tea",
    name: "Black Tea",
    description: "Clean, no-milk brew served hot.",
    price: 15,
    rating: 4.2,
    reviews: 110,
    image: img.onboard3,
    category: "tea",
    sub: "Tea",
    veg: true,
  },
  {
    id: "filter-coffee",
    name: "Filter Coffee",
    description: "South Indian decoction with frothed milk.",
    price: 30,
    rating: 4.6,
    reviews: 420,
    image: img.onboard3,
    category: "tea",
    sub: "Coffee",
    veg: true,
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    description: "Chilled coffee blended thick with ice cream.",
    price: 90,
    rating: 4.5,
    reviews: 260,
    image: img.onboard3,
    category: "tea",
    sub: "Cold Drinks",
    veg: true,
  },
  {
    id: "mango-milkshake",
    name: "Mango Milkshake",
    description: "Alphonso pulp blended with chilled milk.",
    price: 100,
    rating: 4.6,
    reviews: 190,
    image: img.onboard3,
    category: "tea",
    sub: "Milkshakes",
    veg: true,
  },
  {
    id: "fresh-lime",
    name: "Fresh Lime",
    description: "Sweet or salted, shaken with soda.",
    price: 40,
    rating: 4.1,
    reviews: 80,
    image: img.onboard3,
    category: "tea",
    sub: "Fresh Juice",
    veg: true,
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const byCategory = (key: CategoryKey) => products.filter((p) => p.category === key);
export const popularPicks = products.filter((p) =>
  ["chicken-biryani", "chicken-65", "fresh-cream-cake", "masala-chai"].includes(p.id),
);
export const recommended = products.filter((p) =>
  ["murgh-makhani", "hyderabadi-biryani", "black-forest-cake", "filter-coffee"].includes(p.id),
);

export type Coupon = {
  code: string;
  title: string;
  detail: string;
  discount: number;
  minOrder: number;
};

export const coupons: Coupon[] = [
  {
    code: "VINO50",
    title: "Flat ₹50 off",
    detail: "On orders above ₹299. Valid on all categories.",
    discount: 50,
    minOrder: 299,
  },
  {
    code: "BIRYANI25",
    title: "₹25 off on biryani",
    detail: "Applies to any biryani order above ₹199.",
    discount: 25,
    minOrder: 199,
  },
  {
    code: "TEATIME",
    title: "₹15 off tea & snacks",
    detail: "Evening special, orders above ₹99.",
    discount: 15,
    minOrder: 99,
  },
  {
    code: "VINO100",
    title: "Flat ₹100 off",
    detail: "Party orders above ₹899 only.",
    discount: 100,
    minOrder: 899,
  },
];

export const offers = [
  {
    id: "o1",
    title: "50% off up to ₹100",
    detail: "On your first Vino order today",
    code: "VINO50",
    image: img.heroBiryani,
  },
  {
    id: "o2",
    title: "Buy 1 Get 1 on tea",
    detail: "Every day, 4 PM – 7 PM",
    code: "TEATIME",
    image: img.onboard3,
  },
  {
    id: "o3",
    title: "Cakes at flat ₹100 off",
    detail: "Celebration cakes above ₹899",
    code: "VINO100",
    image: img.freshCreamCake,
  },
];

export type PastOrder = {
  id: string;
  placedAt: string;
  status: "delivered" | "cancelled" | "on-the-way" | "preparing" | "order-placed";
  items: { productId: string; qty: number }[];
  total: number;
  paymentMethod?: "online" | "cod" | undefined;
  cancellationReason?: string | undefined;
};

export const pastOrders: PastOrder[] = [
  {
    id: "VH1045",
    placedAt: "Today, 1:20 PM",
    status: "preparing",
    items: [
      { productId: "chicken-biryani", qty: 1 },
      { productId: "garlic-naan", qty: 2 },
    ],
    total: 340,
    paymentMethod: "online",
  },
  {
    id: "VH1032",
    placedAt: "24 Aug, 8:05 PM",
    status: "delivered",
    items: [
      { productId: "paneer-butter-masala", qty: 1 },
      { productId: "masala-chai", qty: 2 },
    ],
    total: 310,
    paymentMethod: "cod",
  },
  {
    id: "VH1019",
    placedAt: "18 Aug, 5:40 PM",
    status: "cancelled",
    items: [{ productId: "black-forest-cake", qty: 1 }],
    total: 450,
    paymentMethod: "online",
    cancellationReason: "Ordered by mistake",
  },
];

export const notifications = [
  {
    id: "n1",
    icon: "local_shipping",
    title: "Order VH1045 is on the way",
    detail: "Anoop is 8 minutes away with your biryani.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "n2",
    icon: "local_offer",
    title: "Tea hour is live",
    detail: "Buy 1 get 1 on all teas until 7 PM.",
    time: "1 h ago",
    unread: true,
  },
  {
    id: "n3",
    icon: "cake",
    title: "Fresh cakes just landed",
    detail: "Black forest and fresh cream, baked this morning.",
    time: "Yesterday",
    unread: false,
  },
];

export const recentSearches = ["Chicken biryani", "Black forest cake", "Masala chai"];
export const popularSearches = ["Biryani", "Puffs", "Cold coffee", "Meals", "Dosa"];

export const inr = (n: number) => `₹${n.toFixed(0)}`;
