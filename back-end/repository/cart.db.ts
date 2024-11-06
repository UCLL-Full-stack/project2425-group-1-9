
import { Cart } from "../model/cart";

// DO NOT MODIFY!! Depends on cartContainsProductDB.
const carts: Array<Cart> = [
    new Cart({
        id: 2,
        totalPrice: 0,
        customerId: 1,
    }),
    // One customer can have many carts. The most recent one is the one with id 3. The customer already made an order with cart 2.
    new Cart({
        id: 3,
        totalPrice: 0,
        customerId: 1,
    })
];
//you need to save the cart after creating it

const saveCart = (cart: Cart): Cart | undefined => {
    const existingCart = carts.findIndex((c) => {
        cart.getId() === c.getId()
    })
    if (existingCart !== -1) {
        carts[existingCart] = cart
    } else {
        carts.push(cart)
    }
    return cart
}


const getCartByCustomerId = (customerId: number | undefined): Cart | null => {
    return carts
        .sort((a: Cart, b: Cart) => b.getId() - a.getId()) // Sort by descending cart id.
        .find((cart) => cart.getCustomerId() === customerId) || null;

}

const getCartById = (cartId: number): Cart | null => {
    return carts.find((cart) => cart.getId() === cartId) || null;
};

const returnAllCartsAvailable = (): Cart[] | null => {
    return carts
}


export default {
    getCartByCustomerId,
    saveCart,
    returnAllCartsAvailable,
    getCartById
};