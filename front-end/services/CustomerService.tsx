import { Customer } from "@/types";
import util from "@/util/util";

// // Q& How would I make this an util method. If I put it into util, it says: sessionStorage is undefined.
// const getLoggedInCustomer = (): Customer => {
//     let loggedInCustomer: Customer | string | null = sessionStorage.getItem('loggedInCustomer');
//     if (loggedInCustomer) {
//       loggedInCustomer = JSON.parse(loggedInCustomer) as Customer;
//     } else {
//       loggedInCustomer = { username: 'guest', role: 'guest' } as Customer; 
//     }

//     return loggedInCustomer;
// }



const clearCart = async (username: string) => {
    
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${username}/cart`,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${util.getLoggedInCustomer().token}`
            }
        }
    );
};

const deleteCartItem = async (username: string, productName: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${username}/cart/${productName}`,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${util.getLoggedInCustomer().token}`
            }
        }
    );
};

const createOrUpdateCartItem = async (username: string, productName: string, change?: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${username}/cart/${productName}?change=${change}`,
        {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${util.getLoggedInCustomer().token}`
            }
        }
    );
};


const getCartItemsByCustomerUsername = async (username: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${username}/cart`,
        {
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${util.getLoggedInCustomer().token}`
            }
        }
    );
}

const getTotalCartPriceByCustomerUsername = async (username: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${username}/cart/totalPrice`,
        {
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${util.getLoggedInCustomer().token}`
            }
        }
    );
};

const loginCustomer = async (customer: Customer) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/login`,
        {
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(customer),
        }
    );
};

const CustomerService = {
    clearCart,
    createOrUpdateCartItem,
    getCartItemsByCustomerUsername,
    deleteCartItem,
    getTotalCartPriceByCustomerUsername,
    loginCustomer
}

export default CustomerService;