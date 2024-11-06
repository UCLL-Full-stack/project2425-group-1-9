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

const clearCart = async (customerUsername: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${customerUsername}/cart`,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
};

const addCartItem = async (customerUsername: string, productName: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${customerUsername}/cart/${productName}`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
};


const fetchCartItemsByCustomerUsername = async(username: string) => {
    return fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${username}/cart`,
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
    fetchCartItemsByCustomerUsername
}

export default CustomerService;