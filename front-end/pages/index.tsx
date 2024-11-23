import Header from "@/components/header";
import Head from "next/head";
import styles from "../styles/home.module.css";
import Product from "@/components/product";
import { useState, useEffect } from "react";
import ProductService from "@/services/ProductService";
import CustomerService from "@/services/CustomerService";
import { CartItem } from "@/types";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Home: React.FC = () => {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [cartItems, setCartItems] = useState<CartItem[]>([]); // Cart items required only to get the quantity of the product.
  // const [getCustomerUsername(), setCustomerUsername] = useState(sessionStorage.getItem("loggedInUser") || "guest");
  const getCustomerUsername = () => sessionStorage.getItem("loggedInUser") || "guest";

  const getProductsAndCartItems = async () => {
    const responses = await Promise.all([
      ProductService.getAllProducts(),
      CustomerService.getCartItemsByCustomerUsername(getCustomerUsername()),
    ]);
    const [productsResponse, cartItemsResponse] = responses;
    const products = await productsResponse.json();
    const cartItems = await cartItemsResponse.json();

    products.sort((a: Product, b: Product) => a.name < b.name ? -1 : 1) // Sort products based on descending name.

    return {
      products,
      cartItems
    };
  };

  const { data, isLoading, error } = useSWR(
    "productsAndCartItems",
    getProductsAndCartItems
  );

  useInterval(() => {
    mutate("productsAndCartItems", getProductsAndCartItems())
    console.log(getCustomerUsername());
  }, 5000);

  // const getProducts = async () => {
  //   const response = await ProductService.getAllProducts();
  //   const productss = await response.json();
  //   productss.sort((a: Product, b: Product) => a.name < b.name ? -1 : 1) // Sort products based on descending name.
  //   setProducts(productss);
  // };

  // const getCartItemsByCustomerUsername = async (getCustomerUsername(): string) => {
  //     const response = await CustomerService.getCartItemsByCustomerUsername(getCustomerUsername());
  //     const cartItemss: CartItem[] = await response.json();
  //     setCartItems(cartItemss);
  // };

  // Highlight current tab in header.
  const highlightCurrentTabInMenu = () => {
    const cartTabElement = document.querySelector("header nav a:nth-child(1)");
    if (cartTabElement) cartTabElement.setAttribute("style", "background-color: green;");
  };

  const addToCart = async (productName: string) => {
    await CustomerService.createOrUpdateCartItem(getCustomerUsername(), productName, "increase");
    mutate("productsAndCartItems", getProductsAndCartItems());
    // await getCartItemsByCustomerUsername(getCustomerUsername());
    // await getProducts();
  }

  useEffect(() => {
    // getProducts();
    // getCartItemsByCustomerUsername(getCustomerUsername());
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
        {/* Q&A Why fragments here? In the video, he also does it.  A: That's for fun. */}
        <>
          {error && <p>Error: {error}</p>}
          {isLoading && <p>Loading...</p>}

          <section className={styles.products}>
            {// products &&
              data &&
              (<Product 
                  products={data.products}
                  addToCart={addToCart}
                  cartItems={data.cartItems}/>)}
          </section>
        </>

      </main>
    </>
  );
};

export default Home;
