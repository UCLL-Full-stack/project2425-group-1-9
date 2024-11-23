import Header from "@/components/header";
import Product from "@/components/product";
import ProductService from "@/services/ProductService";
import styles from "../../styles/home.module.css";
import { useState, useEffect } from "react";
// import CartService from "@/services/CartService";
import CartItem from "@/components/cartItem";
import CustomerService from "@/services/CustomerService";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { useRouter } from "next/router";

const Cart: React.FC = () => {
    const getCustomerUsername = () => sessionStorage.getItem("loggedInUser") || "guest";

    const router = useRouter();
    // const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // const getCartItemsByCustomerUsername = async (customerUsername: string) => {
    //     const response = await CustomerService.getCartItemsByCustomerUsername(customerUsername);
    //     const cartItemss: CartItem[] = await response.json();
    //     cartItemss.sort((a: CartItem, b: CartItem) => a.product.name < b.product.name ? -1 : 1) // Sort items based on descending product name.
    //     setCartItems(cartItemss);
    // };

    const getCartItemsAndTotalCartPrice = async () => {
        const responses = Promise.all([
            CustomerService.getCartItemsByCustomerUsername(getCustomerUsername()),
            CustomerService.getTotalCartPriceByCustomerUsername(getCustomerUsername())
        ]);

        const [cartItemsResponse, totalCartPriceResponse] = await responses;

        const cartItems = await cartItemsResponse.json();
        const totalCartPrice = await totalCartPriceResponse.json();

        cartItems.sort((a: CartItem, b: CartItem) => a.product.name < b.product.name ? -1 : 1) // Sort items based on descending product name.

        return {
            cartItems,
            totalCartPrice
        };
    };

    const { data, isLoading, error } = useSWR(
        "getCartItemsAndTotalCartPrice",
        getCartItemsAndTotalCartPrice
    );

    useInterval(() => {
        mutate("getCartItems", getCartItemsAndTotalCartPrice());
    }, 5000);


    const clearCart = async () => {
        // setCartItems([]);
        await CustomerService.clearCart(getCustomerUsername()); // TODO: should not be hardcoded.
        mutate("getCartItemsAndTotalCartPrice", getCartItemsAndTotalCartPrice()); // Q&A Is it okay to do mutate here? Or should I make a useState and change it to trigger render? A: Fake it or just keep pulling. In a real life application they will fake it.
        // await getCartItemsByCustomerUsername(getCustomerUsername()); // TODO: Cart id should not be hardcoded!
    };

    const deleteCartItem = async (cartItem: CartItem) => {
        await CustomerService.deleteCartItem(getCustomerUsername(), cartItem.product.name);
        mutate("getCartItemsAndTotalCartPrice", getCartItemsAndTotalCartPrice());
        // await getCartItemsByCustomerUsername(getCustomerUsername());
    }

    const changeQuantity = async (cartItem: CartItem, change: string) => {
        await CustomerService.createOrUpdateCartItem(cartItem.cart.customer.username, cartItem.product.name, change);
        mutate("getCartItemsAndTotalCartPrice", getCartItemsAndTotalCartPrice());
        // await getCartItemsByCustomerUsername(getCustomerUsername()); // TODO: Cart id should not be hardcoded!
    };

    // const getTotalCartPrice = (): number => {
    //     let totalCartPrice: number = 0;
    //     for (let cartItem of data.cartItems) {
    //         const cartItemTotalPrice: number = cartItem.product.price * cartItem.quantity;
    //         totalCartPrice = totalCartPrice + cartItemTotalPrice;
    //     };
    //     return totalCartPrice;
    // };

    // Highlight current tab in header.
    const highlightCurrentTabInMenu = () => {
        const cartTabElement = document.querySelector("header nav a:nth-child(2)");
        console.log(cartTabElement);
        if (cartTabElement) cartTabElement.setAttribute("style", "background-color: green;");
    };

    useEffect(() => {
    //   getCartItemsByCustomerUsername(getCustomerUsername()); // TODO: Cart id should not be hardcoded!
      highlightCurrentTabInMenu();

    }, []);

    return (
        <>
            <Header />
            <main className={styles.main}>
                <>
                    {error && <p>Error: {error}</p>}
                    {isLoading && <p>Loading...</p>}

                    <button onClick={clearCart} >Clear Cart</button>
                    <button onClick={() => {router.push(`/cart/order`)}}>Place Order</button>
                    {data && <p>Total price: {String(data.totalCartPrice)} $</p>}

                    <section className={styles.products}>
                    {data &&
                        (<CartItem 
                            cartItems={data.cartItems}
                            changeQuantity={changeQuantity}
                            deleteCartItem={deleteCartItem}/>)}
                    </section>
                </>
            </main>  
        </>
    );

};

export default Cart;