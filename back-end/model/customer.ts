export class Customer {
    id: number;
    private password: string;
    private securityQuestion: string;
    private username: string;
    private firstName: string;
    private lastName: string;
    private phone: number;

    constructor(customer: {
        id: number;
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
        if (!customer.password) throw new Error("Password is required.");
        if (!customer.securityQuestion) throw new Error("Security question is required.");
        if (!customer.username) throw new Error("Username is required.");
        if (!customer.firstName) throw new Error("First name is required.");
        if (!customer.lastName) throw new Error("Last name is required.");
        if (!customer.phone) throw new Error("Phone is required.");
    }

    getId(): number {
        return this.id;
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