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

const CustomerService = {
    clearCart,
    addCartItem,
    getCartItemsByCustomerUsername
}

export default CustomerService;