import { Cart } from "../model/cart";
import { Customer } from "../model/customer";
import { Order } from "../model/order";
import cartDb from "../repository/cart.db";
import customerDb from "../repository/customer.db";
import orderDb from "../repository/order.db";
import { OrderInput } from "../types";
import cartService from "./cart.service";

const createOrder = async ({date, customer: customerInput}: OrderInput) => {
    // GET
    if (!date) throw new Error("Date is required.");

    // Q& Is this the way of using Input types?
    if (!customerInput) throw new Error("Customer's username is required.");
    if (!customerInput.username) throw new Error("Customer's username is required.");
    const customer: Customer | null = await customerDb.getCustomerByUsername(customerInput.username);
    if (!customer) throw new Error("Customer does not exist.");

    const cart: Cart | null = await cartDb.getActiveCartByCustomerId(customer.getId());
    if (!cart) throw new Error("Cart does not exist.");
    
    const totalCartPrice: number = await cartService.getTotalCartPriceByCartId(cart.getId());
    if (!totalCartPrice) throw new Error("Cart is empty.");

    const orderWithSameCart: Order | null = await orderDb.getOrderByCartId(cart.getId());
    if (orderWithSameCart) throw new Error("Order with this cart has already been made.");


    // CONNECT
    const order = new Order({cart, date, customer});

    // SAVE
    await cartService.createNewActiveCartAndDeactivateTheCurrentOne(cart);
    return await orderDb.createOrder(order);
};

export default {
    createOrder
};