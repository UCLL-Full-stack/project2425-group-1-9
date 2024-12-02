type CartInput = {
    id?: number;
    totalPrice?: number;
    active?: boolean;
    customer?: CustomerInput;
};

type CustomerInput = {
    id?: number;
    password: string;
    securityQuestion: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: number;
    role: Role;
};

type OrderInput= {
    cart?: CartInput;
    date?: Date;
    customer?: CustomerInput;
};

type AuthenticationResponse = {
    token: string;
    username: string;
    fullname: string;
    role: Role;
};

type Role = 'admin' | 'customer' | 'guest';

export {
    OrderInput,
    CustomerInput,
    CartInput,
    AuthenticationResponse,
    Role
}