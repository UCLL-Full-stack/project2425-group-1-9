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


  // SWR FETCHERS. -----------------------------
  const fetcherCartItems = async () => {
    const response = await CustomerService.getCartItemsByCustomerUsername(util.getLoggedInCustomer().username);
    const result = await response.json();
    return {result};
  };

  const fetcherAllProducts = async () => {
    const response = await ProductService.getAllProducts();
    const result = await response.json()
    result.sort((a: Product, b: Product) => a.name < b.name ? -1 : 1) // Sort products based on descending name.
    return {result};
  };

  const fetcherSearchedProducts = async () => {
    const response = await ProductService.searchProducts(query);
    const result = await response.json()
    result.sort((a: Product, b: Product) => a.name < b.name ? -1 : 1) // Sort products based on descending name.
    return {result};
  };

  const { data: dataCartItems } = useSWR(
    // https://swr.vercel.app/docs/conditional-fetching
    util.getLoggedInCustomer().username !== "guest" ? "cartItems" : null,
    fetcherCartItems
  );

  const { data: dataProducts, isLoading, error } = useSWR(
    !query ? "products" : null,
    fetcherAllProducts
  );

  const { data: dataSearchedProducts } = useSWR(
    query ? "searchedProducts" : null,
    fetcherSearchedProducts
  );

  const pooling = () => {
    mutate("products", fetcherAllProducts())

    if (util.getLoggedInCustomer().username !== "guest") {
      mutate("cartItems", fetcherCartItems())
    }

    if (query) {
      mutate("searchedProducts", fetcherSearchedProducts())
    }
  };

  useInterval(pooling, 5000);

  const addToCart = async (productName: string) => {
    await CustomerService.createOrUpdateCartItem(util.getLoggedInCustomer().username, productName, "increase");
    pooling();
  }

  // Search form.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent page reload.
    event.preventDefault();
    // Clear status messages to prevent piling them up.
    if (!query) {
      setStatusMessage("Search string required.");
      return
    }

    mutate("searchedProducts", fetcherSearchedProducts())
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
          <button type="button" onClick={() => setQuery("")}>Clear Search</button>

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
              (dataProducts || dataSearchedProducts) &&
              (<Product 
                  products={!query ? dataProducts?.result : dataSearchedProducts?.result}
                  addToCart={addToCart}
                  cartItems={dataCartItems ? dataCartItems.result : []}/>)}
          </section>
      </main>
    </>
  );
};

export default Home;

