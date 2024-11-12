import { CartContainsProduct } from "../model/cartContainsProduct";
import database from "./database";

const getAllCartItemsByCartId = async (cartId: number): Promise<CartContainsProduct[]> => {
    try {
        const cartItemsPrisma = await database.cartContainsProduct.findMany({
            include: { 
                cart: { include: { customer: true } }, 
                product: true
            },
            where: {
                cartId: cartId
            }
        });
        return cartItemsPrisma.map((cartItemPrisma) => CartContainsProduct.from(cartItemPrisma));

    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
};

const getCartItemByCartIdAndProductName = async (cartId: number, productName: string): Promise<CartContainsProduct | null> => {
    try {
        const cartItemPrisma = await database.cartContainsProduct.findFirst({
            include: { 
                cart: { include: { customer: true } }, 
                product: true
            },
            where: {
                cartId: cartId,
                productName: productName
            }
        });
        return cartItemPrisma ? CartContainsProduct.from(cartItemPrisma) : null;

    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
};

const createOrUpdateCartItem = async ({ cart, product, quantity }: CartContainsProduct): Promise<string> => {
    try {
        await database.cartContainsProduct.create({ 
            data: {
                cart: {
                    connect: { id: cart.getId() }
                },
                product: {
                    connect: { name: product.getName() }
                },
                quantity: quantity
            },
            include: { 
                cart: { include: { customer: true } }, 
                product: true
            }
         });
        return "Cart item added successfully." // Q& Should we instead return the newly created object?

    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
};

const updateCartItem = async ({ cart, product, quantity }: CartContainsProduct): Promise<string> => {
    try {
        await database.cartContainsProduct.update({
            where: {
                cartId_productName: { // Compound primary key.
                    cartId: cart.getId(),
                    productName: product.getName()
                }
            },
            data: {
                quantity: quantity // Only quantity can be updated.
            },
            include: { 
                cart: { include: { customer: true } }, 
                product: true
            }
         });
        return "Cart item updated successfully." // Q& Should we instead return the newly created object? TODO: more descriptive return message.

    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
};

// const deleteCartItemByCartIdAndProductName = (cartId: number | undefined, name: string): string | null => {
//     for (let i = 0; i < cartContainsProduct.length; i++) {
//         if (cartContainsProduct[i].getProduct().getName() === name && cartContainsProduct[i].getCart().getId() === cartId) {
//             cartContainsProduct.splice(i, 1);
//             return "Successfully deleted item from cart.";
//         }
//     }
//     return null
// };

const deleteCartItemByCartIdAndProductName = async (cartId: number, productName: string) => {
    try {
        await database.cartContainsProduct.delete({
            where: {
                cartId_productName: {
                    cartId: cartId,
                    productName: productName
                }
            }
        });
        return "Deleted successfully.";
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');  
    }
}

const deleteCartItemsByCartId = async (cartId: number): Promise<string> => {
    try {
        await database.cartContainsProduct.deleteMany({
            where: {
                cartId: cartId
            }
        });
        return "Cart items deleted successfully."

    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
};

export default {
    getAllCartItemsByCartId,
    getCartItemByCartIdAndProductName,
    createOrUpdateCartItem,
    deleteCartItemsByCartId,
    updateCartItem,
    deleteCartItemByCartIdAndProductName
}