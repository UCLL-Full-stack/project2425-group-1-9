import { Cart } from "../../model/cart";
import { CartContainsProduct } from "../../model/cartContainsProduct";
import { Customer } from "../../model/customer";
import { Product } from "../../model/product";
import cartDb from "../../repository/cart.db";
import cartContainsProductDb from "../../repository/cartContainsProduct.db";
import customerDb from "../../repository/customer.db";
import productDb from "../../repository/product.db";
import cartService from "../../service/cart.service";


// GIVEN -----------------------------------
const customer: Customer = new Customer({
    id: 1,
    password: "m@t3j-v3s3l",
    securityQuestion: "What is the name of the best friend from childhood?", // TODO: We also need security answer. It may also be a list.
    username: "Matej333",
    firstName: "Matej",
    lastName: "Vesel",
    phone: 333444555666
})

// const customerWithoutCart: Customer = new Customer({
//     id: 2,
//     password: "r0l@nd/nd1m3/s0n3",
//     securityQuestion: "What is the name of the best friend from childhood?", // TODO: We also need security answer. It may also be a list.
//     username: "Roland333",
//     firstName: "Roland",
//     lastName: "Ndime Sone",
//     phone: 444555666777
// })

const cart: Cart = new Cart({
    id: 3,
    totalPrice: 30,
    active: true,
    customer
})

const resourceImagePath: String = "/images/"; // refers to "front-end/public/images".
const products: Product[] = [
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
const cartContainsProduct: CartContainsProduct = new CartContainsProduct({
    cart,
    product: products[1],
    quantity: 5
});

const customerId: number = customer.getId();
const productName: string = products[1].getName();
const cartId: number = cart.getId();

// SETUP -----------------------------------

// Q& Is this correct way to do it?

let mockGetProductsByCartId: jest.Mock;
let mockGetCartItemsByCustomerUsername: jest.Mock;
let mockAddProductToCart: jest.Mock;
let mockDeleteCartItemsByCustomerUsername: jest.Mock;

let mockCartContainsProductDb_getCartItemByCartIdAndProductName: jest.Mock;
let mockCartContainsProductDb_getAllCartItemsByCartId: jest.Mock;
let mockCartContainsProductDb_createCartItem: jest.Mock;
let mockCartContainsProductDb_deleteCartItemsByCustomerId: jest.Mock;
let mockCartContainsProduct_updateCartItem: jest.Mock;
let mockProductDb_getProductByName: jest.Mock;
let mockCartDb_getActiveCartByCustomerId: jest.Mock;
let mockCustomerDb_getCustomerByUsername: jest.Mock;

beforeEach(() => {
    mockGetProductsByCartId = jest.fn();
    mockGetCartItemsByCustomerUsername = jest.fn();
    mockAddProductToCart = jest.fn();
    mockDeleteCartItemsByCustomerUsername = jest.fn();

    mockCartContainsProductDb_getCartItemByCartIdAndProductName = jest.fn();
    mockCartContainsProductDb_getAllCartItemsByCartId = jest.fn();
    mockCartContainsProductDb_getAllCartItemsByCartId = jest.fn();
    mockCartContainsProductDb_createCartItem = jest.fn();
    mockCartContainsProductDb_deleteCartItemsByCustomerId = jest.fn();
    mockCartContainsProduct_updateCartItem = jest.fn();

    mockProductDb_getProductByName = jest.fn();

    mockCartDb_getActiveCartByCustomerId = jest.fn();

    mockCustomerDb_getCustomerByUsername = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});


// TESTS -----------------------------------


test('Given cart ID; When calling getProductsByCartId; Then a list of products from the corresponding cart are returned.', async () => {
    // GIVEN
    // Variables at the top of the file.
    cartContainsProductDb.getAllCartItemsByCartId = mockCartContainsProductDb_getAllCartItemsByCartId.mockReturnValue([
        new CartContainsProduct({ cart, product: products[0], quantity: 5 }),
        new CartContainsProduct({ cart, product: products[1], quantity: 5 }),
    ]);

    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValueOnce(new Product({
        name: "Mouse",
        price: 10,
        unit: "piece",
        stock: 16,
        description: "A computer mouse (plural mice, also mouses)[nb 1] is a hand-held pointing device that detects two-dimensional motion relative to a surface. This motion is typically translated into the motion of the pointer (called a cursor) on a display, which allows a smooth control of the graphical user interface of a computer.",
        imagePath: "mouse.png"
    }))

    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValueOnce(new Product({
        name: "Bananas",
        price: 5,
        unit: "bunch",
        stock: 22,
        description: "A banana is an elongated, edible fruit -- botanically a berry[1] -- produced by several kinds of large herbaceous flowering plants in the genus Musa. In some countries, cooking bananas are called plantains, distinguishing them from dessert bananas. The fruit is variable in size, color and firmness, but is usually elongated and curved, with soft flesh rich in, starch covered with a peel, which may have a variety of colors when ripe. It grows upward in clusters near the top of the plant. Almost all modern edible seedless (parthenocarp) cultivated bananas come from two wild species -- Musa acuminata and Musa balbisiana, or hybrids of them.",
        imagePath: "bananas.png"
    }))


    // WHEN
    const result: Product[] = await cartService.getProductsByCartId(cartId);


    // THEN
    expect(result[0].getName()).toEqual("Mouse");
    expect(result[1].getName()).toEqual("Bananas");

    expect(mockCartContainsProductDb_getAllCartItemsByCartId).toHaveBeenCalledTimes(1);
    expect(mockCartContainsProductDb_getAllCartItemsByCartId).toHaveBeenCalledWith(cartId);

    expect(mockProductDb_getProductByName).toHaveBeenCalledTimes(2);
});

test('Given no cart ID; When calling getProductsByCartId; Then an error is thrown.', () => {
    // GIVEN
    // Variables at the top of the file.

    // WHEN
    const getProductsByCartId = () => cartService.getProductsByCartId(0);

    // THEN
    expect(getProductsByCartId).rejects.toThrow("Cart ID is required.");
});

// SKIPPED: Because the logic will most likely change with the real database.
test('Given product name does not exist in the product database; When calling getProductsByCartId; Then an error is thrown.', () => {
    // GIVEN
    // Variables at the top of the file.
    cartContainsProductDb.getAllCartItemsByCartId = mockCartContainsProductDb_getAllCartItemsByCartId.mockReturnValue([
        new CartContainsProduct({ cart, product: products[0], quantity: 5 }),
        new CartContainsProduct({ cart, product: products[1], quantity: 5 }),
    ]);

    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValueOnce(products[1])

    // WHEN
    const getProductsByCartId = () => cartService.getProductsByCartId(cartId);

    // THEN
    expect(getProductsByCartId).rejects.toThrow("Product does not exist.");

    expect(mockCartContainsProductDb_getAllCartItemsByCartId).toHaveBeenCalledTimes(1);
    expect(mockCartContainsProductDb_getAllCartItemsByCartId).toHaveBeenCalledWith(cartId);
});

test("Given customer's username; When calling getCartItemsByCustomerUsername; Then cart items of that customer are returned.", async () => {
    // GIVEN
    // Variables at the top of the file.
    cartDb.getActiveCartByCustomerId = mockCartDb_getActiveCartByCustomerId.mockReturnValue(cart);
    customerDb.getCustomerByUsername = mockCustomerDb_getCustomerByUsername.mockReturnValue(customer);

    cartContainsProductDb.getAllCartItemsByCartId = mockCartContainsProductDb_getAllCartItemsByCartId.mockReturnValue([
        new CartContainsProduct({ cart, product: products[0], quantity: 5 }),
        new CartContainsProduct({ cart, product: products[1], quantity: 5 })
    ]);


    // WHEN
    const result: CartContainsProduct[] = await cartService.getCartItemsByCustomerUsername(customer.getUsername());


    // THEN
    expect(result[0].getProduct().getName()).toEqual("Mouse");
    expect(result[1].getProduct().getName()).toEqual("Bananas");

    expect(mockCartDb_getActiveCartByCustomerId).toHaveBeenCalledTimes(1);
    expect(mockCartDb_getActiveCartByCustomerId).toHaveBeenCalledWith(customer.getId());

    expect(mockCartContainsProductDb_getAllCartItemsByCartId).toHaveBeenCalledTimes(1);
    expect(mockCartContainsProductDb_getAllCartItemsByCartId).toHaveBeenCalledWith(cart.getId());

});

test("Given no customer's username; When calling getCartItemsByCustomerId; Then error is thrown.", () => {
    // GIVEN
    // Variables at the top of the file.

    // WHEN
    const getCartItemsByCustomerId = () => cartService.getCartItemsByCustomerUsername("");

    // THEN
    expect(getCartItemsByCustomerId).rejects.toThrow("Customer's username is required.");

});

test('Given customer without a cart; When calling getCartItemsByCustomerId; Then error is thrown.', async () => {
    // GIVEN
    // Variables at the top of the file.
    cartDb.getActiveCartByCustomerId = mockCartDb_getActiveCartByCustomerId.mockReturnValue(null);

    // WHEN
    const getCartItemsByCustomerId = () => cartService.getCartItemsByCustomerUsername(customer.getUsername());

    // THEN
    expect(getCartItemsByCustomerId).rejects.toThrow("Cart does not exist.");
});

test("Given customer's username and product name; When calling addProductToCart; Then product is added to customer's cart and message indicating success is returned.", async () => {
    // GIVEN
    // Variables at the top of the file.
    customerDb.getCustomerByUsername = mockCustomerDb_getCustomerByUsername.mockReturnValue(customer);
    cartDb.getActiveCartByCustomerId = mockCartDb_getActiveCartByCustomerId.mockReturnValue(cart);
    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValue(products[1])
    cartContainsProductDb.getCartItemByCartIdAndProductName = mockCartContainsProductDb_getCartItemByCartIdAndProductName.mockReturnValue(cartContainsProduct);
    cartContainsProductDb.updateCartItem = mockCartContainsProduct_updateCartItem.mockReturnValue(null);


    // WHEN
    const result: string = await cartService.addProductToCart(customer.getUsername(), productName);


    // THEN
    expect(result).toEqual("Product successfully added to cart.");

    expect(mockCustomerDb_getCustomerByUsername).toHaveBeenCalledTimes(1);
    expect(mockCustomerDb_getCustomerByUsername).toHaveBeenCalledWith(customer.getUsername());

    expect(mockCartDb_getActiveCartByCustomerId).toHaveBeenCalledTimes(1);
    expect(mockCartDb_getActiveCartByCustomerId).toHaveBeenCalledWith(customer.getId());

    expect(mockProductDb_getProductByName).toHaveBeenCalledTimes(1);

    expect(mockCartContainsProductDb_getCartItemByCartIdAndProductName).toHaveBeenCalledTimes(1);
    expect(mockCartContainsProductDb_getCartItemByCartIdAndProductName).toHaveBeenCalledWith(cart.getId(), productName);

});

test("Given no customer's username; When calling addProductToCart; Then error is thrown.", () => {
    // GIVEN
    // Variables at the top of the file.

    // WHEN
    const addProductToCart = () => cartService.addProductToCart("", productName);

    // THEN
    expect(addProductToCart).rejects.toThrow("Customer's username is required.");

});

test('Given customer with ID does not exist in the database; When calling addProductToCart; Then error is thrown.', () => {
    // GIVEN
    // Variables at the top of the file.
    customerDb.getCustomerByUsername = mockCustomerDb_getCustomerByUsername.mockReturnValue(null);

    // WHEN
    const addProductToCart = () => cartService.addProductToCart(customer.getUsername(), productName);

    // THEN
    expect(addProductToCart).rejects.toThrow("Customer does not exist.");
});

test('Given customer without a cart; When calling addProductToCart; Then error is thrown.', () => {
    // GIVEN
    // Variables at the top of the file.
    customerDb.getCustomerByUsername = mockCustomerDb_getCustomerByUsername.mockReturnValue(customer);
    cartDb.getActiveCartByCustomerId = mockCartDb_getActiveCartByCustomerId.mockReturnValue(null);


    // WHEN
    const addProductToCart = () => cartService.addProductToCart(customer.getUsername(), productName);

    // THEN
    expect(addProductToCart).rejects.toThrow("Cart does not exist.");

});

test('Given no product name; When calling addProductToCart; Then error is thrown', () => {
    // GIVEN
    // Variables at the top of the file.
    const productName: string = "Bananas";
    customerDb.getCustomerByUsername = mockCustomerDb_getCustomerByUsername.mockReturnValue(customer);
    cartDb.getActiveCartByCustomerId = mockCartDb_getActiveCartByCustomerId.mockReturnValue(cart);


    // WHEN
    const addProductToCart = () => cartService.addProductToCart(customer.getUsername(), "");

    // THEN
    expect(addProductToCart).rejects.toThrow("Product name is required.");

});

test('Given product does not exist in the database; When calling addProductToCart; Then error is thrown.', () => {
    // GIVEN
    // Variables at the top of the file.
    const productName: string = "Bananas";
    customerDb.getCustomerByUsername = mockCustomerDb_getCustomerByUsername.mockReturnValue(customer);
    cartDb.getActiveCartByCustomerId = mockCartDb_getActiveCartByCustomerId.mockReturnValue(cart);
    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValue(null);

    // WHEN
    const addProductToCart = () => cartService.addProductToCart(customer.getUsername(), productName);

    // THEN
    expect(addProductToCart).rejects.toThrow("Product does not exist.");

});

// test("Given customer's username; When calling deleteCartItemsByCustomerUsername; Then customer's cart is deleted and message indicating success is returned.", async () => {
//     // GIVEN
//     // Variables at the top of the file.
//     customerDb.getCustomerByUsername = mockCustomerDb_getCustomerByUsername.mockReturnValue(customer);
//     cartDb.getActiveCartByCustomerId = mockCartDb_getActiveCartByCustomerId.mockReturnValue(cart);
//     cartContainsProductDb.deleteCartItemsByCustomerUsername = mockCartContainsProductDb_deleteCartItemsByCustomerId.mockReturnValue("Cart items deleted successfully.");

//     // WHEN
//     const result: string = await cartService.deleteCartItemsByCustomerUsername(customer.getUsername());

//     // THEN
//     expect(result).toEqual("Cart items deleted successfully.");

//     expect(mockCustomerDb_getCustomerByUsername).toHaveBeenCalledTimes(1);
//     expect(mockCustomerDb_getCustomerByUsername).toHaveBeenCalledWith(customer.getUsername());

//     expect(mockCartDb_getActiveCartByCustomerId).toHaveBeenCalledTimes(1);
//     expect(mockCartDb_getActiveCartByCustomerId).toHaveBeenCalledWith(customer.getId());

//     expect(mockCartDb_getActiveCartByCustomerId).toHaveBeenCalledTimes(1);
//     expect(mockCartDb_getActiveCartByCustomerId).toHaveBeenCalledWith(customer.getId());

// });

test("Given no customer's username; When calling deleteCartItemsByCustomerUsername; Then error is thrown.", async () => {
    // GIVEN
    // Variables at the top of the file.

    // WHEN
    const deleteCartItemsByCustomerUsername = () => cartService.deleteCartItemsByCustomerUsername("");

    // THEN
    expect(deleteCartItemsByCustomerUsername).rejects.toThrow("Customer's username is required.");

});

test('Given customer does not exist in the database; When calling deleteCartItemsByCustomerUsername; Then error is thrown.', async () => {
    // GIVEN
    // Variables at the top of the file.
    customerDb.getCustomerByUsername = mockCustomerDb_getCustomerByUsername.mockReturnValue(null);

    // WHEN
    const deleteCartItemsByCustomerUsername = () => cartService.deleteCartItemsByCustomerUsername(customer.getUsername());

    // THEN
    expect(deleteCartItemsByCustomerUsername).rejects.toThrow("Customer does not exist.");

});

test('Given a customer without a cart; When calling deleteCartItemsByCustomerUsername; Then error is thrown.', async () => {
    // GIVEN
    // Variables at the top of the file.
    customerDb.getCustomerByUsername = mockCustomerDb_getCustomerByUsername.mockReturnValue(customer);
    cartDb.getActiveCartByCustomerId = mockCartDb_getActiveCartByCustomerId.mockReturnValue(null);

    // WHEN
    const deleteCartItemsByCustomerUsername = () => cartService.deleteCartItemsByCustomerUsername(customer.getUsername());

    // THEN
    expect(deleteCartItemsByCustomerUsername).rejects.toThrow("Cart does not exist.");

});
