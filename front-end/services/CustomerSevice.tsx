// const addCartItem = async ({ cartId, productName }: CartItem ) => {
//     return await fetch(
//         process.env.NEXT_PUBLIC_API_URL + "/carts/addtocart",
//         {
//             method: "POST",
//             body: JSON.stringify({
//                     "cartId": cartId,
//                     "productName": productName
//             }),
//             headers: {
//                 'Content-Type': 'application/json',
//                 Accept: 'application/json'
//             }
//         }
//     );
// };

import { CartItem } from "@/types";

const clearCart = async (customerId: number) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${customerId}/cart`,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
};

const addCartItem = async (customerId: number, productName: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${customerId}/cart/${productName}`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
};


const fetchCartItemsByCustomerId = async(id: number) => {
    return fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${id}/cart`,
        {
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        }
    );
}

const CustomerService = {
    clearCart,
    addCartItem,
    fetchCartItemsByCustomerId
}

export default CustomerService;