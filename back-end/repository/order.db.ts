import { Order } from "../model/order";
import database from "./database";

const createOrder = async ({cart, date, customer}: Order): Promise<string> => {
    try {
        await database.order.create({
            data: {
                cart: {
                    connect: { id: cart.getId() }
                },
                date: date,
                customer: {
                    connect: { id: customer.getId() }
                }
            }
        });
        return "Order placed successfully."

    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
};

const getOrderByCartId = async (cartId: number): Promise<Order | null> => {
        try {
            const orderPrisma = await database.order.findUnique({
                include: {
                    cart: { include: { customer: true } }, 
                    customer: true
                },
                where: {
                    cartId: cartId
                }
            });

            return orderPrisma ? Order.from(orderPrisma) : null;
        } catch (error) {
            console.log(error);
            throw new Error('Database error. See server logs for details.');
        }
};

export default {
    createOrder,
    getOrderByCartId
};