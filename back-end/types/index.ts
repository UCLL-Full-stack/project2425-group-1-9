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
};

type OrderInput= {
    cart?: CartInput;
    date?: Date;
    customer?: CustomerInput;
};

export {
    OrderInput,
    CustomerInput,
    CartInput
}