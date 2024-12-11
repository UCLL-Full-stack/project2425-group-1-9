import { Customer } from "@/types";
import util from "@/util/util";

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

const registerCustomer = async (customer: Customer) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/register`,
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
    loginCustomer,
    registerCustomer
}

export default CustomerService;