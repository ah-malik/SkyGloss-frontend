import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type AccessType = "technician" | "shop" | "distributor" | null;

export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface AuthContextType {
  accessType: AccessType;
  setAccessType: (type: AccessType) => void;
  user: any;
  setUser: (user: any) => void;
  cartCount: number;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  addToCart: (product: any, selectedSizeStr: string, quantity?: number) => void;
  updateQuantity: (id: string, size: string, delta: number) => void;
  removeFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  logout: () => void;
  showCartSheet: boolean;
  setShowCartSheet: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessType, setAccessTypeState] = useState<AccessType>(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.role || null;
    }
    return null;
  });
  const [user, setUserState] = useState<any>(() => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  });
  const [showCartSheet, setShowCartSheet] = useState(false);

  const setAccessType = (type: AccessType) => {
    setAccessTypeState(type);
  };

  const setUser = (userData: any) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setAccessTypeState(userData.role);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setAccessTypeState(null);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('skygloss_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('skygloss_cart', JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: any, selectedSizeStr: string, quantity: number = 1) => {
    const sizeData = product.sizes.find((s: any) => s.size === selectedSizeStr);
    const price = sizeData ? sizeData.price : 0;

    const existingItem = cart.find(
      item => item.id === product._id && item.size === selectedSizeStr
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product._id && item.size === selectedSizeStr
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product._id,
        name: product.name,
        size: selectedSizeStr,
        price,
        quantity,
        image: product.images[0]
      }]);
    }
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id && item.size === size) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string, size: string) => {
    setCart(cart.filter(item => !(item.id === id && item.size === size)));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AuthContext.Provider
      value={{
        accessType,
        setAccessType,
        user,
        setUser,
        cartCount,
        cart,
        setCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        logout,
        showCartSheet,
        setShowCartSheet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
