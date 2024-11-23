import {
    Customer as CustomerPrisma,
    Order as OrderPrisma,
    Cart as CartPrisma
} from '@prisma/client';
export class Customer {
    id?: number;
    readonly password: string;
    readonly securityQuestion: string;
    readonly username: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly phone: number;

    constructor(customer: {
        id?: number;
        password: string;
        securityQuestion: string;
        username: string;
        firstName: string;
        lastName: string;
        phone: number;
    }) {
        this.validate(customer);

        this.id = customer.id;
        this.password = customer.password;
        this.securityQuestion = customer.securityQuestion;
        this.username = customer.username;
        this.firstName = customer.firstName;
        this.lastName = customer.lastName;
        this.phone = customer.phone;
    }

    validate(customer: { password: string, securityQuestion: string, username: string, firstName: string, lastName: string, phone: number }) {
        if (!customer.password?.trim()) throw new Error("Password is required.");
        if (!customer.securityQuestion?.trim()) throw new Error("Security question is required.");
        if (!customer.username?.trim()) throw new Error("Username is required.");
        if (!customer.firstName?.trim()) throw new Error("First name is required.");
        if (!customer.lastName?.trim()) throw new Error("Last name is required.");
        if (!customer.phone) throw new Error("Phone is required.");
    }
    
    static from({
        id,
        password,
        securityQuestion,
        username,
        firstName,
        lastName,
        phone
    }: CustomerPrisma) {
    // }: CustomerPrisma & { order: OrderPrisma; cart: CartPrisma[] }) {
        return new Customer({
            id,
            password,
            securityQuestion,
            username,
            firstName,
            lastName,
            phone,
            // order: Order.from(order),
            // cart: Cart.from(cart)
        });
    };

    getId(): number {
        return this.id || 1;
    }

    getPassword(): string {
        return this.password;
    }

    getSecurityQuestion(): string {
        return this.securityQuestion;
    }

    getUsername(): string {
        return this.username;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getPhone(): number {
        return this.phone;
    }
}