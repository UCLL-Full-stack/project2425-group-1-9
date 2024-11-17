import { Cart } from "../model/cart";
import { CartContainsProduct } from "../model/cartContainsProduct";
import cartDb from "../repository/cart.db";
import cartItemService from "./cartItem.service";

const createNewActiveCartAndDeactivateTheCurrentOne = async (currentCart: Cart) => {
    // GET
    // The method is called from another service, so validation is not needed.
    const totalPrice: number = await getTotalCartPriceByCustomerUsername(currentCart.getCustomer().getUsername());

    // CONNECT
    currentCart.setActive(false);
    currentCart.setTotalPrice(totalPrice);

    // SAVE
    cartDb.updateCart(currentCart);
    cartDb.createActiveCartByCustomerId(currentCart.getCustomer().getId());
};

const getTotalCartPriceByCustomerUsername = async (customerUsername: string) => {
    let totalPrice: number = 0;

    const cartItems: CartContainsProduct[] = await cartItemService.getCartItemsByCustomerUsername(customerUsername);
    for (let cartItem of cartItems) {
        totalPrice += cartItem.getProduct().getPrice() * cartItem.getQuantity();
    };

    return totalPrice;
};

export default {
    createNewActiveCartAndDeactivateTheCurrentOne,
    getTotalCartPriceByCustomerUsername
};