
export class Cart {
    private id: number;
    private totalPrice: number;
    private customerId: number;

    // Q& Is it not better to use setters immediately in the constructor?
    //I also thought of the same thing. I thing we could
    //do we need any extra logic for setId methods in the classes?

    constructor(cart: { id: number, totalPrice: number, customerId: number }) {
        this.validate(cart);

        this.id = cart.id;
        this.totalPrice = cart.totalPrice;
        this.customerId = cart.customerId;
    }

    validate(cart: { totalPrice: number }) {
        if (cart.totalPrice < 0) throw new Error("Total price must be non-negative.");
    }

    getId(): number {
        return this.id;
    }

    getTotalPrice(): number {
        return this.totalPrice
    }

    getCustomerId(): number {
        return this.customerId;
    }

}