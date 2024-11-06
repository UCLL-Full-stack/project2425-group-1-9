import { Cart } from '../../model/cart';

const id: number = 8872523;
const totalPrice: number = 50;
const customerId: number = 522567;

// Q&A Do we have to write given when then with colons and semi-colons? A: Doesn't matter as long as it's clear.
test('Given valid values; When creating a cart; Then cart is created with those values.', () => {
    // GIVEN 
    // Values at the top of this file.

    // WHEN
    const cart: Cart = new Cart({ id, totalPrice: totalPrice, customerId: customerId });

    // THEN
    expect(cart.getId()).toEqual(id);
    expect(cart.getTotalPrice()).toEqual(totalPrice);
    expect(cart.getCustomerId()).toEqual(customerId);
});

test('Given cart with negative total price; When creating a cart; Then error is thrown.', () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createCart = () => new Cart({ id, totalPrice: -50, customerId });

    // THEN
    expect(createCart).toThrow("Total price must be non-negative.");
});