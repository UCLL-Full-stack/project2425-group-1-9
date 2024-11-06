import { CartContainsProduct } from "../../model/cartContainsProduct";

const cartId: number = 1;
const productName: string = "Bananas";
const quantity: number = 0;

test('Given valid values; When creating CartContainsProduct object; Then object is created with those values.', () => {
    // GIVEN 
    // Values at the top of this file.

    // WHEN
    const cartContainsProduct: CartContainsProduct = new CartContainsProduct({ cartId, productName, quantity });

    // THEN
    expect(cartContainsProduct.getCartId()).toBe(cartId);
    expect(cartContainsProduct.getProductName()).toBe(productName);
    expect(cartContainsProduct.getQuantity()).toBe(quantity);
});

test('Given no product name; When creating CartContainsProduct object; Then error is thrown.', () => {
    // GIVEN 
    // Values at the top of this file.

    // WHEN
    const createCartContainsProduct = () => new CartContainsProduct({ cartId, productName: "", quantity });

    // THEN
    expect(createCartContainsProduct).toThrow("Product name is required.");
});

test('Given negative quantity; When creating CartContainsProduct object; Then error is thrown.', () => {
    // GIVEN 
    // Values at the top of this file.

    // WHEN
    const createCartContainsProduct = () => new CartContainsProduct({ cartId, productName, quantity: -10 });

    // THEN
    expect(createCartContainsProduct).toThrow("Quantity must be non-negative.");
});

