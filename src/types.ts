export interface Product {
  id: string;
  name: string;
  enName: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  specs: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserSession {
  whatsappNumber: string;
  name: string;
  isLoggedIn: boolean;
  address?: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
}
