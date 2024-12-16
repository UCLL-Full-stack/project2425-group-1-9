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
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";


const Home: React.FC = () => {
  const { t } = useTranslation();

  const [query, setQuery] = useState("");
  // const [queryResults, setQueryResults] = useState<Manual[]>([]);
  const [statusMessage, setStatusMessage] = useState("");


  // SWR FETCHERS. -----------------------------
  const fetcherCartItems = async () => {
    const response = await CustomerService.getCartItemsByCustomerUsername();
    const result = await response.json();
    return {result};
  };

  const fetcherAllProducts = async () => {
    // Because guest cannot use the secure path. But products have to be under secure path because I change functionality based on the token, which is a requirement.
    if (['guest'].includes(util.getLoggedInCustomer().username)) {
      return await fetcherSearchedProducts("*");
    };

    const response = await ProductService.getAllProducts();
    const result = await response.json()
    result.sort((a: Product, b: Product) => a.name < b.name ? -1 : 1) // Sort products based on descending name.
    return {result};
  };

  // Look away, shady things are going on here.
  const fetcherSearchedProducts = async (x?: string) => {
    let response;
    if (x === "*") {
      response = await ProductService.searchProducts(x);
    } else {
      response = await ProductService.searchProducts(query);
    }

    const result = await response.json()
    result.sort((a: Product, b: Product) => a.name < b.name ? -1 : 1) // Sort products based on descending name.
    return {result};
  };

  const { data: dataCartItems } = useSWR(
    // https://swr.vercel.app/docs/conditional-fetching
    // util.getLoggedInCustomer().username !== "guest" ? "cartItems" : null,
    (!['guest', 'admin'].includes(util.getLoggedInCustomer().username)) ? "cartItems" : null,
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

    if (!['guest', 'admin'].includes(util.getLoggedInCustomer().username)) {
      mutate("cartItems", fetcherCartItems())
    }

    if (query) {
      mutate("searchedProducts", fetcherSearchedProducts())
    }
  };

  // useInterval(pooling, 5000);

  const addToCart = async (productName: string) => {
    await CustomerService.createOrUpdateCartItem(productName, "increase");
    pooling();
  }

  // Search form.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent page reload.
    event.preventDefault();

    // Clear status messages to prevent piling them up
    setStatusMessage("");
    
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
          <button type="button" onClick={() => {
            setQuery("")
            setStatusMessage("")}}>Clear Search</button>

        </form>
        
        {statusMessage && 
        <p className="">{statusMessage}</p>}
      </div>

        {/* Q&A Why fragments here? In the video, he also does it.  A: That's for fun. */}
          {error && <p>Error: {error}</p>}
          {isLoading && <p>Loading...</p>}

          {['guest', 'admin'].includes(util.getLoggedInCustomer().username) && <p>Log-in to shop!</p>}
          {['admin'].includes(util.getLoggedInCustomer().username) && <p>Removed products are also shown for the admin.</p>}

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

// Q& Type?
export const getServerSideProps = async (context) => {
  const { locale } = context;

  return {
      props: {
          ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
  };
};

export default Home;

