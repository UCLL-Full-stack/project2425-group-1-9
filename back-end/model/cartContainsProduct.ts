
export class CartContainsProduct {
    private cartId: number;
    private productName: string;
    quantity: number = 0;

    constructor(cartContainsProduct: { cartId: number, productName: string, quantity: number }) {
        this.validate(cartContainsProduct);

        this.cartId = cartContainsProduct.cartId;
        this.productName = cartContainsProduct.productName;
        this.quantity = cartContainsProduct.quantity;
    }

    validate(cartContainsProduct: { productName: string, quantity: number }) {
        if (!cartContainsProduct.productName) throw new Error('Product name is required.');
        if (cartContainsProduct.quantity < 0) throw new Error("Quantity must be non-negative.");
    }

    getCartId(): number {
        return this.cartId
    }
    getProductName(): string {
        return this.productName
    }
    getQuantity(): number {
        if (this.quantity === undefined) {
            throw new Error("Quantity is undefined");
        }
        return this.quantity;
    }
}