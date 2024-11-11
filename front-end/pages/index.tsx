import Header from "@/components/header";
import Head from "next/head";
import styles from "../styles/home.module.css";
import Product from "@/components/product";
import { useState, useEffect } from "react";
import ProductService from "@/services/ProductService";
import CustomerService from "@/services/CustomerService";
import { CartItem } from "@/types";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Cart items required only to get the quantity of the product.

  const getProducts = async () => {
    const response = await ProductService.getAllProducts();
    const productss = await response.json();
    productss.sort((a: Product, b: Product) => a.name < b.name ? -1 : 1) // Sort products based on descending name.
    setProducts(productss);
  };

  const getCartItemsByCustomerUsername = async (customerUsername: string) => {
      const response = await CustomerService.getCartItemsByCustomerUsername(customerUsername);
      const cartItemss: CartItem[] = await response.json();
      setCartItems(cartItemss);
  };

  // Highlight current tab in header.
  const highlightCurrentTabInMenu = () => {
    const cartTabElement = document.querySelector("header nav a:nth-child(1)");
    if (cartTabElement) cartTabElement.setAttribute("style", "background-color: green;");
  };

  const addToCart = async (productName: string) => {
    await CustomerService.createOrUpdateCartItem("Matej333", productName, "increase");
    await getProducts();
  }

  useEffect(() => {
    getProducts();
    getCartItemsByCustomerUsername("Matej333");
    highlightCurrentTabInMenu();
  }, []);



  return (
    <>
      <Head>
        <title>VESO</title>
        <meta name="description" content="Courses app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/logo.ico" /> */}
      </Head>
      <Header />
      <main className={styles.main}>
        <section className={styles.products}>
          {
            products &&
            (<Product 
                products={products}
                addToCart={addToCart}
                cartItems={cartItems}/>)
          }
        </section>
      </main>
    </>
  );
};

export default Home;
