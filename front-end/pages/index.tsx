import Header from "@/components/header";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Product from "@/components/product";
import { useState, useEffect } from "react";
import ProductService from "@/services/ProductService";
import CustomerService from "@/services/CustomerService";
import { CartItem, Customer } from "@/types";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import util from "@/util/util";


const Home: React.FC = () => {
  const [query, setQuery] = useState("");
  // const [queryResults, setQueryResults] = useState<Manual[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  // https://swr.vercel.app/docs/conditional-fetching

  const getProductsAndCartItems = async () => {
    const responses = await Promise.all([
      ProductService.getAllProducts(),
      ProductService.searchProducts(query),
      CustomerService.getCartItemsByCustomerUsername(util.getLoggedInCustomer().username), // Q& Hydration failed. Look at util/
    ]);
    const [productsResponse, productsSearchResponse, cartItemsResponse] = responses;
    let products = await productsResponse.json();
    const productsSearched = await productsSearchResponse.json();
    const cartItems = await cartItemsResponse.json();

    if (query) {
      products = productsSearched;
    } 

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
    // console.log(getCustomerUsername());
  }, 5000);

  const addToCart = async (productName: string) => {
    await CustomerService.createOrUpdateCartItem(util.getLoggedInCustomer().username, productName, "increase");
    mutate("productsAndCartItems", getProductsAndCartItems());
  }

  // Search form.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent page reload.
    event.preventDefault();
    // Clear status messages to prevent piling them up.
    setStatusMessage("");

    console.log();
    mutate("productsAndCartItems", getProductsAndCartItems())

    setStatusMessage(`Query: ${query}`);
  };

  return (
    <>
      <Head>
        <title>VESO</title>
        <meta name="description" content="Courses app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/logo.ico" /> */}
      </Head>
      <Header highlightedTitle="Home"/>
      <main className={styles.main}>
      <div className="">
        <form 
          className=""
          onSubmit={(event) => handleSubmit(event)}>

          <label 
            className=""
            htmlFor="queryInput">Search: </label>

          <input
              className=""
              type="text"
              id="queryInput" 
              value={query}
              onChange={(event) => setQuery(event.target.value)}
          />

          <button type="submit">Search</button>

        </form>
        
        {statusMessage && 
        <p className="">{statusMessage}</p>}
      </div>

        {/* Q&A Why fragments here? In the video, he also does it.  A: That's for fun. */}
          {error && <p>Error: {error}</p>}
          {isLoading && <p>Loading...</p>}

          {util.getLoggedInCustomer().username === 'guest' && <p>Log-in to shop!</p>}

          <section className={styles.products}>
            {// products &&
              data &&
              (<Product 
                  products={data.products}
                  addToCart={addToCart}
                  cartItems={data.cartItems}/>)}
          </section>
      </main>
    </>
  );
};

export default Home;

