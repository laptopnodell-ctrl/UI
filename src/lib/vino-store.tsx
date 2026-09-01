import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { coupons, getProduct, type Coupon } from "./vino-data";

export type CartLine = {
  key: string;
  productId: string;
  qty: number;
  variant?: string;
  addons: string[];
  unitPrice: number;
};

export type Address = {
  id: string;
  label: "Home" | "Work" | "Other";
  line1: string;
  line2: string;
  city: string;
  pin: string;
  name: string;
  phone: string;
  landmark?: string;
  formattedAddress?: string;
};

export const DEFAULT_ADDRESS_KEY = "vino_default_address";

type Store = {
  hydrated: boolean;
  cart: CartLine[];
  favorites: string[];
  addresses: Address[];
  selectedAddressId: string;
  defaultAddressId: string | null;
  couponCode: string | null;
  instructions: string;
  addToCart: (line: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  addAddress: (a: Omit<Address, "id">) => string;
  removeAddress: (id: string) => void;
  selectAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  applyCoupon: (code: string | null) => void;
  setInstructions: (v: string) => void;

  bill: {
    itemTotal: number;
    deliveryFee: number;
    taxes: number;
    discount: number;
    total: number;
    count: number;
  };
  coupon: Coupon | null;
};

const StoreContext = createContext<Store | null>(null);

const KEY = "vino-store-v1";

const defaultAddresses: Address[] = [
  {
    id: "addr-home",
    label: "Home",
    line1: "12B, Palm Grove Apartments",
    line2: "Panampilly Nagar",
    city: "Kochi",
    pin: "682036",
    name: "Arjun Menon",
    phone: "+91 98470 12345",
  },
  {
    id: "addr-work",
    label: "Work",
    line1: "4th Floor, Lulu Cyber Tower",
    line2: "Infopark, Kakkanad",
    city: "Kochi",
    pin: "682042",
    name: "Arjun Menon",
    phone: "+91 98470 12345",
  },
];

export function VinoStoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<Address[]>(defaultAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState("addr-home");
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [instructions, setInstructionsState] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.cart)) setCart(s.cart);
        if (Array.isArray(s.favorites)) setFavorites(s.favorites);
        if (Array.isArray(s.addresses) && s.addresses.length) setAddresses(s.addresses);
        if (typeof s.selectedAddressId === "string") setSelectedAddressId(s.selectedAddressId);
        if (typeof s.couponCode === "string" || s.couponCode === null) setCouponCode(s.couponCode);
        if (typeof s.instructions === "string") setInstructionsState(s.instructions);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      KEY,
      JSON.stringify({ cart, favorites, addresses, selectedAddressId, couponCode, instructions }),
    );
  }, [hydrated, cart, favorites, addresses, selectedAddressId, couponCode, instructions]);

  const addToCart = useCallback((line: Omit<CartLine, "key">) => {
    const key = [line.productId, line.variant ?? "", [...line.addons].sort().join("+")].join("|");
    setCart((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + line.qty } : l));
      return [...prev, { ...line, key }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const removeLine = useCallback((key: string) => {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const addAddress = useCallback((a: Omit<Address, "id">) => {
    const id = `addr-${Date.now()}`;
    setAddresses((prev) => [...prev, { ...a, id }]);
    setSelectedAddressId(id);
    return id;
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const coupon = useMemo(() => coupons.find((c) => c.code === couponCode) ?? null, [couponCode]);

  const bill = useMemo(() => {
    const itemTotal = cart.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
    const count = cart.reduce((sum, l) => sum + l.qty, 0);
    const deliveryFee = itemTotal === 0 ? 0 : itemTotal >= 499 ? 0 : 40;
    const taxes = Math.round(itemTotal * 0.05);
    const discount = coupon && itemTotal >= coupon.minOrder ? coupon.discount : 0;
    return {
      itemTotal,
      deliveryFee,
      taxes,
      discount,
      total: Math.max(0, itemTotal + deliveryFee + taxes - discount),
      count,
    };
  }, [cart, coupon]);

  const value: Store = {
    hydrated,
    cart,
    favorites,
    addresses,
    selectedAddressId,
    couponCode,
    instructions,
    addToCart,
    setQty,
    removeLine,
    clearCart: () => setCart([]),
    toggleFavorite,
    addAddress,
    removeAddress,
    selectAddress: setSelectedAddressId,
    applyCoupon: setCouponCode,
    setInstructions: setInstructionsState,
    bill,
    coupon,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useVino() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useVino must be used inside VinoStoreProvider");
  return ctx;
}

export function lineProduct(line: CartLine) {
  return getProduct(line.productId);
}
