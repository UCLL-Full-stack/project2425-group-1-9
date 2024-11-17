import { Orderr } from "@/types";

const placeOrder = async (order: Orderr) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/orders`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(order)
        }
    );
};

const OrderService = {
    placeOrder
}

export default OrderService;


const createOrUpdateCartItem = async (customerUsername: string, productName: string, change?: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${customerUsername}/cart/${productName}?change=${change}`,
        {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
};