
import { Cart } from "../model/cart";
import { Customer } from "../model/customer";
import database from "./database";

// DO NOT MODIFY!! Depends on cartContainsProductDB.
// const customer = new Customer({
//     id: 1,
//     password: "m@t3j-v3s3l",
//     securityQuestion: "What is the name of the best friend from childhood?", // TODO: We also need security answer. It may also be a list.
//     username: "Matej333",
//     firstName: "Matej",
//     lastName: "Vesel",
//     phone: 333444555666
// });
// const carts: Array<Cart> = [
//     new Cart({
//         id: 2,
//         totalPrice: 0,
//         active: false,
//         customer
//     }),
//     // One customer can have many carts. The most recent one is the one with id 3. The customer already made an order with cart 2.
//     new Cart({
//         id: 3,
//         totalPrice: 0,
//         active: true,
//         customer
//     })
// ];
//you need to save the cart after creating it

// const saveCart = (cart: Cart): Cart | undefined => {
//     const existingCart = carts.findIndex((c) => {
//         cart.getId() === c.getId()
//     })
//     if (existingCart !== -1) {
//         carts[existingCart] = cart
//     } else {
//         carts.push(cart)
//     }
//     return cart
// }


// const getActiveCartByCustomerId = (customerId: number | undefined): Cart | null => {
//     return carts
//         .sort((a: Cart, b: Cart) => b.getId() - a.getId()) // Sort by descending cart id.
//         .find((cart) => cart.getCustomer().getId() === customerId) || null;
// }

const getActiveCartByCustomerId = async (customerId: number): Promise<Cart | null> => {
    try {
        const cartPrisma = await database.cart.findMany({ 
            include: { customer: true },
            where: {
                customerId: customerId,
                active: true
            }
         });
         if (cartPrisma.length > 1) throw new Error("More than one cart is active in the database."); // Q& Exceptionally throwing errors here, because it fits most.
         return cartPrisma ? Cart.from(cartPrisma[0]) : null;
         
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
};

// const getCartById = (cartId: number): Cart | null => {
//     return carts.find((cart) => cart.getId() === cartId) || null;
// };

const getCartById = async (id: number): Promise<Cart | null>  => {
    try {
        const cartPrisma = await database.cart.findUnique({ 
            include: { customer: true },
            where: {
                id: id
            }
         });
         return cartPrisma ? Cart.from(cartPrisma) : null;

    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
};

// const returnAllCartsAvailable = (): Cart[] | null => {
//     return carts
// }


export default {
    getActiveCartByCustomerId,
    // saveCart,
    // returnAllCartsAvailable,
    getCartById
};