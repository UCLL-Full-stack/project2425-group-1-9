import { CartContainsProduct } from "../model/cartContainsProduct";

// DO NOT MODIFY!!! IT DEPENDS ON cartDB and productDB.
let cartContainsProduct: CartContainsProduct[] = [
    new CartContainsProduct({ cartId: 2, productName: "Bread", quantity: 2 }),
    new CartContainsProduct({ cartId: 2, productName: "Laptop", quantity: 5 }),
    new CartContainsProduct({ cartId: 2, productName: "Mayonnaise", quantity: 5 }),
    new CartContainsProduct({ cartId: 3, productName: "Mouse", quantity: 5 }),
    new CartContainsProduct({ cartId: 3, productName: "Bananas", quantity: 5 }),
];

const getCartItemNamesByCartId = (id: number): string[] => {
    const itemNames: string[] = [];
    for (let item of cartContainsProduct) {
        if (item.getCartId() === id) {
            const productName = item.getProductName();
            if (productName) {
                itemNames.push(productName);
            }
        }
    }
    return itemNames;
};

const getCartByCartIdAndProductName = (cartId: number, productName: string): CartContainsProduct | null => {
    // const nameAndIdCheck = cartContainsProduct.find((e) => {
    //     e.getCartId() === cartId && e.getProductName() === productName
    // })

    let nameAndIdCheck;
    for (let element of cartContainsProduct) {
        if (element.getCartId() === cartId && element.getProductName() === productName) {
            nameAndIdCheck = element
        }
    };

    if (!nameAndIdCheck) return null;

    return nameAndIdCheck;
}

// Cart item is product in the cart.
const addCartItem = (cartItem: CartContainsProduct) => {
    cartContainsProduct.push(cartItem);
    return "Cart item added successfully."
};

// const addOrUpdateProduct = (cartItem: CartContainsProduct): CartContainsProduct => {
//     const existingCartItem = getCartByCartIdAndProductName(cartItem.getCartId(), cartItem.getProductName())
//     if (existingCartItem) {
//         cartItem.setQuantity(existingCartItem.getQuantity() + cartItem.getQuantity())
//     } else {
//         cartContainsProduct.push(cartItem)
//     }
//     return cartItem
// }

// const getCartItemByCartId, returns a list of all items with the correct cart id.
const returnAllItemsInCart = (cartId: number | undefined): CartContainsProduct[] => {
    return cartContainsProduct.filter(item => item.getCartId() === cartId)
}//now we have a list of carts that match a particular cart id

const deleteCartItemByCartIdAndProductName = (cartId: number | undefined, name: string): string | null => {
    for (let i = 0; i < cartContainsProduct.length; i++) {
        if (cartContainsProduct[i].getProductName() === name && cartContainsProduct[i].getCartId() === cartId) {
            cartContainsProduct.splice(i, 1);
            return "Successfully deleted item from cart.";
        }
    }
    return null
};

const deleteCartItemsByCustomerUsername = (cartId: number): string => {
    cartContainsProduct = cartContainsProduct.filter((item) => item.getCartId() !== cartId);
    return "Cart items deleted successfully."
};

const getProductsByNameInCart = (cartId: number | undefined, productName: string): CartContainsProduct[] => {
    return returnAllItemsInCart(cartId).filter((matchingCart) => matchingCart.getProductName() === productName)
}

export default {
    getCartItemNamesByCartId,
    deleteCartItemByCartIdAndProductName,
    getCartByCartIdAndProductName,
    // addOrUpdateProduct,
    getProductsByNameInCart,
    returnAllItemsInCart,
    addCartItem,
    deleteCartItemsByCustomerUsername
}