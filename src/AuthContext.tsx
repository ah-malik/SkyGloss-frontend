import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "./api/axios";

export type AccessType = "master_partner" | "regional_partner" | "partner" | "certified_shop" | "admin" | null;


export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  currency?: string;
}

interface AuthContextType {
  accessType: AccessType;
  setAccessType: (type: AccessType) => void;
  user: any;
  setUser: (user: any) => void;
  cartCount: number;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  addToCart: (product: any, selectedSizeStr: string, quantity?: number, explicitPrice?: number) => void;
  updateQuantity: (id: string, size: string, delta: number) => void;
  removeFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  logout: () => void;
  showCartSheet: boolean;
  setShowCartSheet: (v: boolean) => void;
  unreadMessages: number;
  setUnreadMessages: (count: number) => void;
  refreshUnreadCount: () => Promise<void>;
  recentActivities: any[];
  refreshActivities: () => Promise<void>;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
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
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const refreshUnreadCount = async () => {

    if (!user) return;
    try {
      // Use the newly created backend endpoint
      const res = await api.get('/notifications/my-unread');
      setUnreadMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  const refreshActivities = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications/my');
      setRecentActivities(res.data);
    } catch (err) {
      console.error("Failed to fetch recent activities", err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    try {
      await api.patch('/notifications/mark-all-my-read');
      await refreshUnreadCount();
      await refreshActivities();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  useEffect(() => {
    if (user) {
      refreshUnreadCount();
      refreshActivities();
    } else {
      setUnreadMessages(0);
      setRecentActivities([]);
    }
  }, [user]);

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

  const addToCart = (product: any, selectedSizeStr: string, quantity: number = 1, explicitPrice?: number) => {
    const sizeData = product.sizes?.find((s: any) => s.size === selectedSizeStr);
    // Use explicit price if provided (from ProductDetailPage), otherwise fall back to sizeData.price
    const price = explicitPrice !== undefined ? explicitPrice : (sizeData ? Number(sizeData.price) || 0 : 0);

    // Use shopImages for shop products, fall back to images
    const image = product.shopImages?.[0] || product.images?.[0] || '';

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
        image,
        currency: product.currency
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
        unreadMessages,
        setUnreadMessages,
        refreshUnreadCount,
        recentActivities,
        refreshActivities,
        isChatOpen,
        setIsChatOpen,
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
