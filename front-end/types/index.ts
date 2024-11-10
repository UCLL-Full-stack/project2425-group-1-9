export type Course = {
  id: number;
  name: string;
  description: string;
  phase: number;
  credits: number;
};

export type Lecturer = {
  id: number;
  user: User;
  expertise: string;
  courses: Course[];
};

export type User = {
  firstName?: string;
  lastName?: string;
  fullname?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: string;
};

export type Cart = {
  cartId?: number | undefined
  customerId?: number | undefined
  totalPrice?: number
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
  quantity?: number | undefined
}

