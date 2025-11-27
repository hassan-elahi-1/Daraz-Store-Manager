export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Stored in plain text as requested for personal use
  darazStoreLink?: string;
}

export interface Product {
  id: string;
  userId: string;
  title: string;
  images: string[];
  costPrice: number;
  sellPrice: number;
  stock: number;
  darazLink: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface MonthlyStats {
  month: string;
  totalProducts: number;
  totalCost: number;
  totalProfit: number;
  revenue: number;
}