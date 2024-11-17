export type Customer = {
  id?: number;
  password?: string;
  securityQuestion?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: number;
}

export type Cart = {
  id: number
  customer: Customer
  totalPrice: number
  active: boolean;
}

export type Product = {
  name: string;
  price: number;
  unit: string;
  stock: number;
  description: string;
  imagePath: string;
};

export type CartItem = {
  cart: Cart,
  product: Product,
  quantity: number
}

export type StatusMessage = {
  message: string;
  type: "error" | "success";
};

export type Orderr = {
  date: Date;
  customer: Customer;
};