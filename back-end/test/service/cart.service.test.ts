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

const customerWithoutCart: Customer = new Customer({
    id: 2,
    password: "r0l@nd/nd1m3/s0n3",
    securityQuestion: "What is the name of the best friend from childhood?", // TODO: We also need security answer. It may also be a list.
    username: "Roland333",
    firstName: "Roland",
    lastName: "Ndime Sone",
    phone: 444555666777
})

const cart: Cart = new Cart({
    id: 1,
    totalPrice: 30,
    customerId: 1,
})

const customerId: number = 1;
const productName: string = "Bananas";
const cartId: number = 3;

// SETUP -----------------------------------

// Q& Is this correct way to do it?

let mockGetProductsByCartId: jest.Mock;
let mockGetCartItemsByCustomerId: jest.Mock;
let mockAddProductToCart: jest.Mock;
let mockDeleteAllCartItems: jest.Mock;

let mockCartContainsProductDb_getCartByCartIdAndProductName: jest.Mock;
let mockCartContainsProductDb_getCartItemNamesByCartId: jest.Mock;
let mockCartContainsProductDb_returnAllItemsInCart: jest.Mock;
let mockCartContainsProductDb_addCartItem: jest.Mock;
let mockCartContainsProductDb_deleteAllCartItems: jest.Mock;
let mockProductDb_getProductByName: jest.Mock;
let mockCartDb_getCartByCustomerId: jest.Mock;
let mockCustomerDb_getCustomerById: jest.Mock;

beforeEach(() => {
    mockGetProductsByCartId = jest.fn();
    mockGetCartItemsByCustomerId = jest.fn();
    mockAddProductToCart = jest.fn();
    mockDeleteAllCartItems = jest.fn();

    mockCartContainsProductDb_getCartByCartIdAndProductName = jest.fn();
    mockCartContainsProductDb_getCartItemNamesByCartId = jest.fn();
    mockCartContainsProductDb_returnAllItemsInCart = jest.fn();
    mockCartContainsProductDb_addCartItem = jest.fn();
    mockCartContainsProductDb_deleteAllCartItems = jest.fn();
    mockProductDb_getProductByName = jest.fn();
    mockCartDb_getCartByCustomerId = jest.fn();
    mockCustomerDb_getCustomerById = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});


// TESTS -----------------------------------


test('Given cart ID; When calling getProductsByCartId; Then a list of products from the corresponding cart are returned.', async () => {
    // GIVEN
    // Variables at the top of the file.
    cartContainsProductDb.getCartItemNamesByCartId = mockCartContainsProductDb_getCartItemNamesByCartId.mockReturnValue([
        new CartContainsProduct({ cartId: 3, productName: "Mouse", quantity: 5 }),
        new CartContainsProduct({ cartId: 3, productName: "Bananas", quantity: 5 }),
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

    expect(mockCartContainsProductDb_getCartItemNamesByCartId).toHaveBeenCalledTimes(1);
    expect(mockCartContainsProductDb_getCartItemNamesByCartId).toHaveBeenCalledWith(cartId);

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
    cartContainsProductDb.getCartItemNamesByCartId = mockCartContainsProductDb_getCartItemNamesByCartId.mockReturnValue([
        new CartContainsProduct({ cartId: 3, productName: "Mouse", quantity: 5 }),
        new CartContainsProduct({ cartId: 3, productName: "Bananas", quantity: 5 }),
    ]);

    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValueOnce(new Product({
        name: "Mouse",
        price: 10,
        unit: "piece",
        stock: 16,
        description: "A computer mouse (plural mice, also mouses)[nb 1] is a hand-held pointing device that detects two-dimensional motion relative to a surface. This motion is typically translated into the motion of the pointer (called a cursor) on a display, which allows a smooth control of the graphical user interface of a computer.",
        imagePath: "mouse.png"
    }))

    // WHEN
    const getProductsByCartId = () => cartService.getProductsByCartId(cartId);

    // THEN
    expect(getProductsByCartId).rejects.toThrow("Product does not exist.");

    expect(mockCartContainsProductDb_getCartItemNamesByCartId).toHaveBeenCalledTimes(1);
    expect(mockCartContainsProductDb_getCartItemNamesByCartId).toHaveBeenCalledWith(cartId);
});

test('Given customer ID; When calling getCartItemsByCustomerId; Then cart items of that customer are returned.', async () => {
    // GIVEN
    // Variables at the top of the file.
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(cart);

    cartContainsProductDb.returnAllItemsInCart = mockCartContainsProductDb_returnAllItemsInCart.mockReturnValue([
        new CartContainsProduct({ cartId: 3, productName: "Mouse", quantity: 5 }),
        new CartContainsProduct({ cartId: 3, productName: "Bananas", quantity: 5 })
    ]);


    // WHEN
    const result: CartContainsProduct[] = await cartService.getCartItemsByCustomerId(customer.getId());


    // THEN
    expect(result[0].getProductName()).toEqual("Mouse");
    expect(result[1].getProductName()).toEqual("Bananas");

    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledTimes(1);
    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(1);

    expect(mockCartContainsProductDb_returnAllItemsInCart).toHaveBeenCalledTimes(1);
    expect(mockCartContainsProductDb_returnAllItemsInCart).toHaveBeenCalledWith(customer.getId());

});

test('Given no customer ID; When calling getCartItemsByCustomerId; Then error is thrown.', () => {
    // GIVEN
    // Variables at the top of the file.

    // WHEN
    const getCartItemsByCustomerId = () => cartService.getCartItemsByCustomerId(0);

    // THEN
    expect(getCartItemsByCustomerId).rejects.toThrow("Customer ID is required.");

});

test('Given customer without a cart; When calling getCartItemsByCustomerId; Then error is thrown.', async () => {
    // GIVEN
    // Variables at the top of the file.
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(null);

    // WHEN
    const getCartItemsByCustomerId = () => cartService.getCartItemsByCustomerId(customer.getId());

    // THEN
    expect(getCartItemsByCustomerId).rejects.toThrow("Cart does not exist.");
});

test("Given customer ID and product name; When calling addProductToCart; Then product is added to customer's cart and message indicating success is returned.", async () => {
    // GIVEN
    // Variables at the top of the file.
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(customer);
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(cart);
    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValue(new Product({
        name: "Bananas",
        price: 5,
        unit: "bunch",
        stock: 22,
        description: "A banana is an elongated, edible fruit -- botanically a berry[1] -- produced by several kinds of large herbaceous flowering plants in the genus Musa. In some countries, cooking bananas are called plantains, distinguishing them from dessert bananas. The fruit is variable in size, color and firmness, but is usually elongated and curved, with soft flesh rich in, starch covered with a peel, which may have a variety of colors when ripe. It grows upward in clusters near the top of the plant. Almost all modern edible seedless (parthenocarp) cultivated bananas come from two wild species -- Musa acuminata and Musa balbisiana, or hybrids of them.",
        imagePath: "bananas.png"
    }))
    cartContainsProductDb.getCartByCartIdAndProductName = mockCartContainsProductDb_getCartByCartIdAndProductName.mockReturnValue(cart);


    // WHEN
    const result: string = await cartService.addProductToCart(customer.getId(), productName);


    // THEN
    expect(result).toEqual("Product successfully added to cart.");

    expect(mockCustomerDb_getCustomerById).toHaveBeenCalledTimes(1);
    expect(mockCustomerDb_getCustomerById).toHaveBeenCalledWith(customer.getId());

    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledTimes(1);
    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customer.getId());

    expect(mockProductDb_getProductByName).toHaveBeenCalledTimes(1);

    expect(mockCartContainsProductDb_getCartByCartIdAndProductName).toHaveBeenCalledTimes(1);
    expect(mockCartContainsProductDb_getCartByCartIdAndProductName).toHaveBeenCalledWith(cart.getId(), productName);

});

test('Given no customer ID; When calling addProductToCart; Then error is thrown.', () => {
    // GIVEN
    // Variables at the top of the file.

    // WHEN
    const addProductToCart = () => cartService.addProductToCart(0, productName);

    // THEN
    expect(addProductToCart).rejects.toThrow("Customer ID is required.");

});

test('Given customer with ID does not exist in the database; When calling addProductToCart; Then error is thrown.', () => {
    // GIVEN
    // Variables at the top of the file.
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(null);

    // WHEN
    const addProductToCart = () => cartService.addProductToCart(customer.getId(), productName);

    // THEN
    expect(addProductToCart).rejects.toThrow("Customer does not exist.");
});

test('Given customer without a cart; When calling addProductToCart; Then error is thrown.', () => {
    // GIVEN
    // Variables at the top of the file.
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(customer);
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(null);


    // WHEN
    const addProductToCart = () => cartService.addProductToCart(customer.getId(), productName);

    // THEN
    expect(addProductToCart).rejects.toThrow("Cart does not exist.");

});

test('Given no product name; When calling addProductToCart; Then error is thrown', () => {
    // GIVEN
    // Variables at the top of the file.
    const productName: string = "Bananas";
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(customer);
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(cart);


    // WHEN
    const addProductToCart = () => cartService.addProductToCart(customer.getId(), "");

    // THEN
    expect(addProductToCart).rejects.toThrow("Product name is required.");

});

test('Given product does not exist in the database; When calling addProductToCart; Then error is thrown.', () => {
    // GIVEN
    // Variables at the top of the file.
    const productName: string = "Bananas";
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(customer);
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(cart);
    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValue(null);

    // WHEN
    const addProductToCart = () => cartService.addProductToCart(customer.getId(), productName);

    // THEN
    expect(addProductToCart).rejects.toThrow("Product does not exist.");

});

test("Given customer ID; When calling deleteAllCartItems; Then customer's cart is deleted and message indicating success is returned.", async () => {
    // GIVEN
    // Variables at the top of the file.
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(customer);
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(cart);
    cartContainsProductDb.deleteAllCartItems = mockCartContainsProductDb_deleteAllCartItems.mockReturnValue("Cart items deleted successfully.");

    // WHEN
    const result: string = await cartService.deleteAllCartItems(customer.getId());

    // THEN
    expect(result).toEqual("Cart items deleted successfully.");

    expect(mockCustomerDb_getCustomerById).toHaveBeenCalledTimes(1);
    expect(mockCustomerDb_getCustomerById).toHaveBeenCalledWith(customer.getId());

    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledTimes(1);
    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customer.getId());

    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledTimes(1);
    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(cart.getId());

});

test('Given no customer ID; When calling deleteAllCartItems; Then error is thrown.', async () => {
    // GIVEN
    // Variables at the top of the file.

    // WHEN
    const deleteAllCartItems = () => cartService.deleteAllCartItems(0);

    // THEN
    expect(deleteAllCartItems).rejects.toThrow("Customer ID is required.");

});

test('Given customer does not exist in the database; When calling deleteAllCartItems; Then error is thrown.', async () => {
    // GIVEN
    // Variables at the top of the file.
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(null);

    // WHEN
    const deleteAllCartItems = () => cartService.deleteAllCartItems(customer.getId());

    // THEN
    expect(deleteAllCartItems).rejects.toThrow("Customer does not exist.");

});

test('Given a customer without a cart; When calling deleteAllCartItems; Then error is thrown.', async () => {
    // GIVEN
    // Variables at the top of the file.
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(customer);
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(null);

    // WHEN
    const deleteAllCartItems = () => cartService.deleteAllCartItems(customer.getId());

    // THEN
    expect(deleteAllCartItems).rejects.toThrow("Cart does not exist.");

});
