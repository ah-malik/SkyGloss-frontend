import { createContext, useContext, useState, ReactNode } from "react";

export type AccessType = "technician" | "shop" | "distributor" | null;

interface AuthContextType {
  accessType: AccessType;
  setAccessType: (type: AccessType) => void;
  cartCount: number;
  setCartCount: (count: number) => void;
  showCartSheet: boolean;
  setShowCartSheet: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessType, setAccessType] = useState<AccessType>(null);
  const [cartCount, setCartCount] = useState(0);
  const [showCartSheet, setShowCartSheet] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        accessType,
        setAccessType,
        cartCount,
        setCartCount,
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
