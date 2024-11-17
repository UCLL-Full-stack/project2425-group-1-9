import { Cart } from "../model/cart";
import { CartContainsProduct } from "../model/cartContainsProduct";
import { Customer } from "../model/customer";
import { Product } from "../model/product";
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import customerDb from "../repository/customer.db";
import productDb from "../repository/product.db";

// TODO this should be in another service.
const getProductsByCartId = async (cartId: number): Promise<Product[]> => {
    if (!cartId) throw new Error("Cart ID is required.");


    const cartItems: CartContainsProduct[] | null = await cartContainsProductDb.getAllCartItemsByCartId(cartId);
    if (!cartItems) throw new Error("Cart is empty.");  // TODO add a test for this.
    const cartItemNames: string[] = cartItems.map((cartItem) => cartItem.getProduct().getName());

    const products: Product[] = [];
    for (let name of cartItemNames) {
        const product: Product | null = await productDb.getProductByName(name);
        if (!product) throw new Error("Product does not exist.");

        products.push(product);
    }

    return products;
}

const getCartItemsByCustomerUsername = async (customerUsername: string): Promise<Array<CartContainsProduct>> => {
    if (!customerUsername) throw new Error("Customer's username is required.");
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

// TODO: This should be in another service.
const getTotalCartPriceByCartId = async (cartId: number) => {
    let totalPrice: number = 0;

    const cartItems: CartContainsProduct[] = await cartContainsProductDb.getAllCartItemsByCartId(cartId);
    for (let cartItem of cartItems) {
        totalPrice += cartItem.getProduct().getPrice();
    };

    return totalPrice;
};

// TODO: This should be in another service.
const createNewActiveCartAndDeactivateTheCurrentOne = async (currentCart: Cart) => {
    // GET
    // The method is called from another service, so validation is not needed.
    const totalPrice: number = await getTotalCartPriceByCartId(currentCart.getId());

    // CONNECT
    currentCart.setActive(false);
    currentCart.setTotalPrice(totalPrice);

    // SAVE
    cartDb.updateCart(currentCart);
    cartDb.createActiveCartByCustomerId(currentCart.getCustomer().getId());
};

export default {
    getProductsByCartId,
    getCartItemsByCustomerUsername,
    createOrUpdateCartItem,
    deleteCartItemsByCustomerUsername,
    deleteCartItemByCustomerUsernameAndProductName,
    createNewActiveCartAndDeactivateTheCurrentOne,
    getTotalCartPriceByCartId
}