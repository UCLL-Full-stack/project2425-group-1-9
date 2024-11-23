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

const deleteCartItem = async (customerUsername: string, productName: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${customerUsername}/cart/${productName}`,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
};

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


const getCartItemsByCustomerUsername = async (customerUsername: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${customerUsername}/cart`,
        {
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
}

const getTotalCartPriceByCustomerUsername = async (customerUsername: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${customerUsername}/cart/totalPrice`,
        {
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
};

const CustomerService = {
    clearCart,
    createOrUpdateCartItem,
    getCartItemsByCustomerUsername,
    deleteCartItem,
    getTotalCartPriceByCustomerUsername
}

export default CustomerService;