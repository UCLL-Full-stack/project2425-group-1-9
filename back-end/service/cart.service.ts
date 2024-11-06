import { Cart } from "../model/cart";
import { CartContainsProduct } from "../model/cartContainsProduct";
import { Customer } from "../model/customer";
import { Product } from "../model/product";
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import customerDb from "../repository/customer.db";
import productDb from "../repository/product.db";


const getProductsByCartId = async (cartId: number): Promise<Product[]> => {
    if (!cartId) throw new Error("Cart ID is required.");

    const cartItemNames: string[] = await cartContainsProductDb.getCartItemNamesByCartId(cartId);

    const products: Product[] = [];
    for (let name of cartItemNames) {
        const product: Product | null = await productDb.getProductByName(name);
        if (!product) throw new Error("Product does not exist.");

        products.push(product);
    }

    return products;
}

const getCartItemsByCustomerId = async (customerId: number): Promise<Array<CartContainsProduct>> => {
    if (!customerId) throw new Error("Customer ID is required.");
    const cart: Cart | null = cartDb.getCartByCustomerId(customerId);
    if (!cart) throw new Error("Cart does not exist.");

    return cartContainsProductDb.returnAllItemsInCart(cart.getId());
};

const addProductToCart = async (customerId: number, productName: string): Promise<string> => {
    if (!customerId) throw new Error("Customer ID is required.");
    const customer: Customer | null = await customerDb.getCustomerById(customerId);
    if (!customer) throw new Error("Customer does not exist.");

    const cart: Cart | null = await cartDb.getCartByCustomerId(customer.getId());
    if (!cart) throw new Error("Cart does not exist.");

    if (!productName) throw new Error("Product name is required.");
    const product: Product | null = await productDb.getProductByName(productName);
    if (!product) throw new Error("Product does not exist.");

    let cartItem: CartContainsProduct | null = await cartContainsProductDb.getCartByCartIdAndProductName(cart.getId(), product.getName());
    // if (!cartItem) throw new Error("Cart does not contains the product.");

    // CONNECT & SAVE
    // If cart does not contain the item, create the first one.
    if (!cartItem) {
        cartItem = new CartContainsProduct({
            cartId: cart.getId(),
            productName: product.getName(),
            quantity: 0
        });
        cartContainsProductDb.addCartItem(cartItem); // TODO: This should the only function of a POST request! Updating should be PUT!
    };

    cartItem.quantity = Number(cartItem.getQuantity) + 1; // TODO: This should be a PUT?!\

    return "Product successfully added to cart.";
}

const deleteAllCartItems = async (customerId: number): Promise<string> => {
    // GET
    if (!customerId) throw new Error("Customer ID is required.");
    const customer: Customer | null = customerDb.getCustomerById(customerId);
    if (!customer) throw new Error("Customer does not exist.");

    const cart: Cart | null = cartDb.getCartByCustomerId(customer.getId());
    if (!cart) throw new Error("Cart does not exist.");


    // CONNECT & SAVE
    return await cartContainsProductDb.deleteAllCartItems(cart.getId());
};


// const deleteCartItem = async ({ customerId, productName }: { customerId: number, productName: string }): Promise<string> => {

//     // GET
//     const customer: Customer | null = customerDb.getCustomerById(customerId);
//     if (!customer) throw new Error(`Customer with id ${customerId} does not exist.`);
//     const cart: Cart | null = cartDb.getCartByCustomerId(customer.getId());
//     if (!cart) throw new Error(`Customer ${customer.getUsername()} does not have a cart.`);

//     // CONNECT & SAVE
//     cartContainsProductDb.deleteCartItemByCartIdAndProductName(cart.getId(), productName);
//     return `Cart item '${productName}' deleted successfully.`;
// }

export default { getProductsByCartId, getCartItemsByCustomerId, addProductToCart, deleteAllCartItems }