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

const addProductToCart = async (customerUsername: string, productName: string): Promise<string> => {
    if (!customerUsername) throw new Error("Customer's username is required.");
    const customer: Customer | null = await customerDb.getCustomerByUsername(customerUsername);
    if (!customer) throw new Error("Customer does not exist.");

    const cart: Cart | null = await cartDb.getActiveCartByCustomerId(customer.getId());
    if (!cart) throw new Error("Cart does not exist.");

    if (!productName) throw new Error("Product name is required.");
    const product: Product | null = await productDb.getProductByName(productName);
    if (!product) throw new Error("Product does not exist.");

    let cartItem: CartContainsProduct | null = await cartContainsProductDb.getCartItemByCartIdAndProductName(cart.getId(), product.getName());
    // if (!cartItem) throw new Error("Cart does not contains the product.");

    // CONNECT & SAVE
    // If cart does not contain the item, create the first one.
    if (!cartItem) {
        cartItem = new CartContainsProduct({ cart, product, quantity: 1 });
        await cartContainsProductDb.createCartItem(cartItem); // TODO: This should the only function of a POST request! Updating should be PUT!
    };

    // cartItem.quantity = Number(cartItem.getQuantity) + 1; // connect    TODO: This should be a PUT?!\
    cartItem.setQuantity(cartItem.getQuantity() + 1); // connect    TODO: This should be a PUT?!\
    await cartContainsProductDb.updateCartItem(cartItem); // save

    return "Product successfully added to cart.";
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


// const deleteCartItem = async ({ customerId, productName }: { customerId: number, productName: string }): Promise<string> => {

//     // GET
//     const customer: Customer | null = customerDb.getCustomerById(customerId);
//     if (!customer) throw new Error(`Customer with id ${customerId} does not exist.`);
//     const cart: Cart | null = cartDb.getActiveCartByCustomerId(customer.getId());
//     if (!cart) throw new Error(`Customer ${customer.getUsername()} does not have a cart.`);

//     // CONNECT & SAVE
//     cartContainsProductDb.deleteCartItemByCartIdAndProductName(cart.getId(), productName);
//     return `Cart item '${productName}' deleted successfully.`;
// }

export default { getProductsByCartId, getCartItemsByCustomerUsername, addProductToCart, deleteCartItemsByCustomerUsername }