import Header from "@/components/header";
import Product from "@/components/product";
import ProductService from "@/services/ProductService";
import styles from "../../styles/home.module.css";
import { useState, useEffect } from "react";
// import CartService from "@/services/CartService";
import CartItem from "@/components/cartItem";
import CustomerService from "@/services/CustomerSevice";

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<Array<CartItem>>([]);
    const [products, setProducts] = useState<Array<Product>>([]);

    const fetchCartByCustomerId = async (customerId: number) => {
        const response = await CustomerService.fetchCartItemsByCustomerId(customerId);
        const cartItemss = await response.json();
        setCartItems(cartItemss);
    };

    const getProducts = async () => {
      const response = await ProductService.getAllProducts();
      const productss = await response.json();
      setProducts(productss);
    };

    const updateProduct = async () => {
        // CartService.updateOrAddCartItem();
    };
  
    const incrementQuantity = (productName: string) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productName === productName ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
            )
        );
        updateProduct();
    };

    const decrementQuantity = (name: string) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productName === name ? { ...item, quantity: (item.quantity ? item.quantity - 1: 0) } : item
            )
        );
    };

    const clearCart = () => {
        // setCartItems([]);
        CustomerService.clearCart(1); // TODO: should not be hardcoded.
        fetchCartByCustomerId(1); // TODO: Cart id should not be hardcoded!

    };

    // Highlight current tab in header.
    const highlightCurrentTabInMenu = () => {
        const cartTabElement = document.querySelector("header nav a:nth-child(2)");
        if (cartTabElement) cartTabElement.setAttribute("style", "background-color: green;");
    };

    useEffect(() => {
      getProducts();
      fetchCartByCustomerId(1); // TODO: Cart id should not be hardcoded!
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
                    products={products}
                    incrementQuantity={incrementQuantity}
                    decrementQuantity={decrementQuantity}
                    clearCart={clearCart}
                    />)
                }
                </section>
                <p>Buttons + and - do not work.</p>
            </main>  
        </>
    );

};

export default Cart;