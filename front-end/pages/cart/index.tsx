import Header from "@/components/header";
import Product from "@/components/product";
import ProductService from "@/services/ProductService";
import styles from "../../styles/home.module.css";
import { useState, useEffect } from "react";
// import CartService from "@/services/CartService";
import CartItem from "@/components/cartItem";
import CustomerService from "@/services/CustomerService";

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const getCartItemsByCustomerUsername = async (customerUsername: string) => {
        const response = await CustomerService.getCartItemsByCustomerUsername(customerUsername);
        const cartItemss: CartItem[] = await response.json();
        cartItemss.sort((a: CartItem, b: CartItem) => a.product.name < b.product.name ? -1 : 1) // Sort items based on descending product name.
        setCartItems(cartItemss);
    };

    const clearCart = async () => {
        // setCartItems([]);
        await CustomerService.clearCart("Matej333"); // TODO: should not be hardcoded.
        await getCartItemsByCustomerUsername("Matej333"); // TODO: Cart id should not be hardcoded!
    };

    const deleteCartItem = async (cartItem: CartItem) => {
        await CustomerService.deleteCartItem("Matej333", cartItem.product.name);
        await getCartItemsByCustomerUsername("Matej333");
    }

    const changeQuantity = async (cartItem: CartItem, change: string) => {
        await CustomerService.createOrUpdateCartItem(cartItem.cart.customer.username, cartItem.product.name, change);
        await getCartItemsByCustomerUsername("Matej333"); // TODO: Cart id should not be hardcoded!
    };

    // Highlight current tab in header.
    const highlightCurrentTabInMenu = () => {
        const cartTabElement = document.querySelector("header nav a:nth-child(2)");
        if (cartTabElement) cartTabElement.setAttribute("style", "background-color: green;");
    };

    useEffect(() => {
      getCartItemsByCustomerUsername("Matej333"); // TODO: Cart id should not be hardcoded!
      highlightCurrentTabInMenu();

    }, []);

    return (
        <>
            <Header />
            <main className={styles.main}>
                <button onClick={clearCart} >Clear Cart</button>
                <section className={styles.products}>
                {
                    cartItems &&
                    (<CartItem 
                        cartItems={cartItems}
                        changeQuantity={changeQuantity}
                        deleteCartItem={deleteCartItem}/>)
                }
                </section>
            </main>  
        </>
    );

};

export default Cart;