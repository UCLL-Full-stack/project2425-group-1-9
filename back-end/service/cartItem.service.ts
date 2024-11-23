import { Cart } from "../model/cart";
import { CartContainsProduct } from "../model/cartContainsProduct";
import { Customer } from "../model/customer";
import { Product } from "../model/product";
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import customerDb from "../repository/customer.db";
import productDb from "../repository/product.db";


const getCartItemsByCustomerUsername = async (customerUsername: string): Promise<Array<CartContainsProduct>> => {
    if (!customerUsername) throw new Error("Customer's username is required." + customerUsername);
    const customer: Customer | null = await customerDb.getCustomerByUsername(customerUsername);
    if (!customer) throw new Error("Customer does not exist"); // TODO add a test.

    const cart: Cart | null = await cartDb.getActiveCartByCustomerId(customer.getId());
    if (!cart) throw new Error("Cart does not exist.");

    return await cartContainsProductDb.getAllCartItemsByCartId(cart.getId());
};

const createOrUpdateCartItem = async (customerUsername: string, productName: string, change?: string): Promise<string> => {
    if (!customerUsername) throw new Error("Customer's username is required.");
    const customer: Customer | null = await customerDb.getCustomerByUsername(customerUsername);
    if (!customer) throw new Error("Customer does not exist.");

    const cart: Cart | null = await cartDb.getActiveCartByCustomerId(customer.getId());
    if (!cart) throw new Error("Cart does not exist.");

    if (!productName) throw new Error("Product name is required.");
    const product: Product | null = await productDb.getProductByName(productName);
    if (!product) throw new Error("Product does not exist.");

    let cartItem: CartContainsProduct | null = await cartContainsProductDb.getCartItemByCartIdAndProductName(cart.getId(), product.getName());

    // CONNECT & SAVE
    // Create or Update
    if (!cartItem) {
        cartItem = new CartContainsProduct({ cart, product, quantity: 1 }); // connect
        product.setStock(cartItem.product.getStock() - 1); // connect
        await productDb.updateProductStockByName(product.getName(), product.getStock()); // save
        return await cartContainsProductDb.createOrUpdateCartItem(cartItem); // save
    } else {
        if (change === "increase") {
            product.setStock(cartItem.product.getStock() - 1); // connect
            cartItem.setQuantity(cartItem.getQuantity() + 1); // connect
        }
        if (change === "decrease") {
            product.setStock(cartItem.product.getStock() + 1); // connect
            cartItem.setQuantity(cartItem.getQuantity() - 1); // connect
        }
        await productDb.updateProductStockByName(product.getName(), product.getStock()); // save
        return await cartContainsProductDb.updateCartItem(cartItem); // save
    }

}

const deleteCartItemsByCustomerUsername = async (customerUsername: string): Promise<string> => {
    // GET
    if (!customerUsername) throw new Error("Customer's username is required.");
    const customer: Customer | null = await customerDb.getCustomerByUsername(customerUsername);
    if (!customer) throw new Error("Customer does not exist.");

    const cart: Cart | null = await cartDb.getActiveCartByCustomerId(customer.getId());
    if (!cart) throw new Error("Cart does not exist.");


    // CONNECT & SAVE
    return await cartContainsProductDb.deleteCartItemsByCartId(cart.getId());
};

// TODO total cart price is not updated.
const deleteCartItemByCustomerUsernameAndProductName = async (customerUsername: string, productName: string): Promise<string> => {
    // GET
    if (!customerUsername) throw new Error("Customer's username is required.");
    const customer: Customer | null = await customerDb.getCustomerByUsername(customerUsername);
    if (!customer) throw new Error("Customer does not exist.");

    const cart: Cart | null = await cartDb.getActiveCartByCustomerId(customer.getId());
    if (!cart) throw new Error("Cart does not exist.");

    if (!productName) throw new Error("Product name is required.");
    const product: Product | null = await productDb.getProductByName(productName);
    if (!product) throw new Error("Product does not exist.");

    const cartItem: CartContainsProduct | null = await cartContainsProductDb.getCartItemByCartIdAndProductName(cart.getId(), product.getName());
    if (!cartItem) throw new Error("Item not in cart.");

    // CONNECT & SAVE
    return cartContainsProductDb.deleteCartItemByCartIdAndProductName(cart.getId(), product.getName());
}

export default {
    getCartItemsByCustomerUsername,
    createOrUpdateCartItem,
    deleteCartItemsByCustomerUsername,
    deleteCartItemByCustomerUsernameAndProductName
}