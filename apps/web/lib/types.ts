export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
};

export type CartItem = {
  productId: number;
  quantity: number;
};

export type Order = {
  id: number;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  paymentStatus: string;
};

export type Locale = 'en' | 'ja';

export type CartItemWithProduct = CartItem & {
  product: Product;
};

export type CheckoutFormData = {
  customerName: string;
  customerEmail: string;
};

export type ValidationErrors = Partial<Record<keyof CheckoutFormData, string>>;

export type { SpacingKey, ColorTokenName } from './tokens';
