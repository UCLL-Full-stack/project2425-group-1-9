import { Cart } from "../model/cart";
import { CartContainsProduct } from "../model/cartContainsProduct";
import { Customer } from "../model/customer";
import { Product } from "../model/product";
import database from "./database";

const customer = new Customer({
    id: 1,
    password: "m@t3j-v3s3l",
    securityQuestion: "What is the name of the best friend from childhood?", // TODO: We also need security answer. It may also be a list.
    username: "Matej333",
    firstName: "Matej",
    lastName: "Vesel",
    phone: 333444555666
});
const carts: Array<Cart> = [
    new Cart({
        id: 2,
        totalPrice: 0,
        active: false,
        customer
    }),
    // One customer can have many carts. The most recent one is the one with id 3. The customer already made an order with cart 2.
    new Cart({
        id: 3,
        totalPrice: 0,
        active: true,
        customer
    })
];
const resourceImagePath: String = "/images/"; // refers to "front-end/public/images".
const products = [
    new Product({
        name: "Bread",
        price: 5,
        unit: "piece",
        stock: 25,
        description: "Rye bread is a type of bread made with various proportions of flour from rye grain. It can be light or dark in color, depending on the type of flour used and the addition of coloring agents, and is typically denser than bread made from wheat flour. Compared to white bread, it is higher in fiber, darker in color, and stronger in flavor. The world's largest exporter of rye bread is Poland.",
        imagePath: resourceImagePath + "bread.png"
    }),
    new Product({
        name: "Mayonnaise",
        price: 7,
        unit: "piece",
        stock: 15,
        description: "Mayonnaise is an emulsion of oil, egg yolk, and an acid, either vinegar or lemon juice;[4] there are many variants using additional flavorings. The color varies from near-white to pale yellow, and its texture from a light cream to a thick gel.",
        imagePath: resourceImagePath + "mayonnaise.png"
    }),
    new Product({
        name: "Laptop",
        price: 700,
        unit: "piece",
        stock: 6,
        description: "A laptop computer or notebook computer, also known as a laptop or notebook, is a small, portable personal computer (PC). Laptops typically have a clamshell form factor with a flat-panel screen on the inside of the upper lid and an alphanumeric keyboard and pointing device on the inside of the lower lid.[1][2] Most of the computer's internal hardware is fitted inside the lower lid enclosure under the keyboard, although many modern laptops have a built-in webcam at the top of the screen, and some even feature a touchscreen display. In most cases, unlike tablet computers which run on mobile operating systems, laptops tend to run on desktop operating systems, which were originally developed for desktop computers. ",
        imagePath: resourceImagePath + "laptop.png"
    }),
    new Product({
        name: "Mouse",
        price: 10,
        unit: "piece",
        stock: 16,
        description: "A computer mouse (plural mice, also mouses)[nb 1] is a hand-held pointing device that detects two-dimensional motion relative to a surface. This motion is typically translated into the motion of the pointer (called a cursor) on a display, which allows a smooth control of the graphical user interface of a computer.",
        imagePath: resourceImagePath + "mouse.png"
    }),
    new Product({
        name: "Bananas",
        price: 5,
        unit: "bunch",
        stock: 22,
        description: "A banana is an elongated, edible fruit -- botanically a berry[1] -- produced by several kinds of large herbaceous flowering plants in the genus Musa. In some countries, cooking bananas are called plantains, distinguishing them from dessert bananas. The fruit is variable in size, color and firmness, but is usually elongated and curved, with soft flesh rich in, starch covered with a peel, which may have a variety of colors when ripe. It grows upward in clusters near the top of the plant. Almost all modern edible seedless (parthenocarp) cultivated bananas come from two wild species -- Musa acuminata and Musa balbisiana, or hybrids of them.",
        imagePath: resourceImagePath + "bananas.png"
    })
];

let cartContainsProduct: CartContainsProduct[] = [
    new CartContainsProduct({ cart: carts[0], product: products[0], quantity: 2 }),
    new CartContainsProduct({ cart: carts[0], product: products[1], quantity: 5 }),
    new CartContainsProduct({ cart: carts[0], product: products[2], quantity: 5 }),
    new CartContainsProduct({ cart: carts[1], product: products[3], quantity: 5 }),
    new CartContainsProduct({ cart: carts[1], product: products[4], quantity: 5 }),
];

// const getAllCartItemsByCartId = (cartId: number): CartContainsProduct[] | null => {
//     const cartItems: CartContainsProduct[] = [];
//     for (let item of cartContainsProduct) {
//         if (item.getCart().getId() === cartId) {
//             const productName = item.getProduct().getName();
//             if (productName) {
//                 cartItems.push(item);
//             }
//         }
//     }
//     return cartItems;
// };

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

// const getCartItemByCartIdAndProductName = (cartId: number, productName: string): CartContainsProduct | null => {
//     // const nameAndIdCheck = cartContainsProduct.find((e) => {
//     //     e.getCart().getId() === cartId && e.getProduct().getName() === productName
//     // })

//     let nameAndIdCheck;
//     for (let element of cartContainsProduct) {
//         if (element.getCart().getId() === cartId && element.getProduct().getName() === productName) {
//             nameAndIdCheck = element
//         }
//     };

//     if (!nameAndIdCheck) return null;

//     return nameAndIdCheck;
// }

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


// Cart item is product in the cart.
// const createCartItem = (cartItem: CartContainsProduct) => {
//     cartContainsProduct.push(cartItem);
//     return "Cart item added successfully."
// };

const createCartItem = async ({ cart, product, quantity }: CartContainsProduct): Promise<string> => {
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

// const addOrUpdateProduct = (cartItem: CartContainsProduct): CartContainsProduct => {
//     const existingCartItem = getCartItemByCartIdAndProductName(cartItem.getCart().getId(), cartItem.getProduct().getName())
//     if (existingCartItem) {
//         cartItem.setQuantity(existingCartItem.getQuantity() + cartItem.getQuantity())
//     } else {
//         cartContainsProduct.push(cartItem)
//     }
//     return cartItem
// }

// // const getCartItemByCartId, returns a list of all items with the correct cart id.
// const getAllCartItemsByCartId = (cartId: number | undefined): CartContainsProduct[] => {
//     return cartContainsProduct.filter(item => item.getCart().getId() === cartId)
// }//now we have a list of carts that match a particular cart id

// const getAllCartItemsByCartId = async (cartId: number): Promise<CartContainsProduct[]> => {
//     try {
//         const cartItems = database.cartContainsProduct.findMany({
//             inclide:
//          });
//     } catch (error) {
//         console.log(error);
//         throw new Error('Database error. See server logs for details.'); 
//     }
// };

// const deleteCartItemByCartIdAndProductName = (cartId: number | undefined, name: string): string | null => {
//     for (let i = 0; i < cartContainsProduct.length; i++) {
//         if (cartContainsProduct[i].getProduct().getName() === name && cartContainsProduct[i].getCart().getId() === cartId) {
//             cartContainsProduct.splice(i, 1);
//             return "Successfully deleted item from cart.";
//         }
//     }
//     return null
// };

// const deleteCartItemsByCartId = (cartId: number): string => {
//     cartContainsProduct = cartContainsProduct.filter((item) => item.getCart().getId() !== cartId);
//     return "Cart items deleted successfully."
// };

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


// const getProductsByNameInCart = async (cartId: number, productName: string): Promise<CartContainsProduct[]> => {
//     return await getAllCartItemsByCartId(cartId).filter((matchingCart) => matchingCart.getProduct().getName() === productName)
// }

export default {
    getAllCartItemsByCartId,
    // deleteCartItemByCartIdAndProductName,
    getCartItemByCartIdAndProductName,
    // addOrUpdateProduct,
    // getProductsByNameInCart,
    // getAllCartItemsByCartId,
    createCartItem,
    deleteCartItemsByCartId,
    updateCartItem
}