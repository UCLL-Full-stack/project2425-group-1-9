
export class Order {
    private cartId: number;
    private date: Date;

    constructor(order: { cartId: number, date: Date }) {
        this.validate(order);

        this.cartId = order.cartId;
        this.date = order.date;
    }

    validate(order: { date: Date }) {
        if (!order.date) throw new Error("Date is required.");
    }

    getCartId(): number | undefined {
        return this.cartId
    }

    getDate(): Date {
        return this.date
    }

    equals(newOrder: Order) {
        return (
            newOrder.cartId === this.cartId &&
            newOrder.date === this.date
        )
    }
}