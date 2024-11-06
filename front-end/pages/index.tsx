import Header from "@/components/header";
import Head from "next/head";
import styles from "../styles/home.module.css";
import Product from "@/components/product";
import { useState, useEffect } from "react";
import ProductService from "@/services/ProductService";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Array<Product>>([]);

  const getProducts = async () => {
    const response = await ProductService.getAllProducts();
    const productss = await response.json();
    setProducts(productss);
  };

    // Highlight current tab in header.
    const highlightCurrentTabInMenu = () => {
      const cartTabElement = document.querySelector("header nav a:nth-child(1)");
      if (cartTabElement) cartTabElement.setAttribute("style", "background-color: green;");
  };

  useEffect(() => {
    getProducts();
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
            (<Product products={products} />)
          }
        </section>
      </main>
    </>
  );
};

export default Home;
