import Header from "@/components/header";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
// import CartService from "@/services/CartService";
import CartItem from "@/components/cartItem";
import CustomerService from "@/services/CustomerService";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";


const Cart: React.FC = () => { 
    const [error, setError] = useState<string>("");
    
    const router = useRouter();

    
    const getCartItemsAndTotalCartPrice = async () => {

        const responses = Promise.all([
            CustomerService.getCartItemsByCustomerUsername(),
            CustomerService.getTotalCartPriceByCustomerUsername()
        ]);
        
        const [cartItemsResponse, totalCartPriceResponse] = await responses;
        
        if (!cartItemsResponse.ok) {
            if (cartItemsResponse.status === 401) {
                setError("You are not authorized to access this resource.");
            } else {
                setError(cartItemsResponse.statusText);
            };

            return;
        }

        const cartItems = await cartItemsResponse.json();
        const totalCartPrice = await totalCartPriceResponse.json();
        
        cartItems.sort((a: CartItem, b: CartItem) => a.product.name < b.product.name ? -1 : 1) // Sort items based on descending product name.
        
        return {
            cartItems,
            totalCartPrice
        };
    };
    
    const { data, isLoading } = useSWR(
        "getCartItemsAndTotalCartPrice",
        getCartItemsAndTotalCartPrice
    );

    useInterval(() => {
        mutate("getCartItems", getCartItemsAndTotalCartPrice());
    }, 5000);


    const clearCart = async () => {
        // setCartItems([]);
        await CustomerService.clearCart(); // TODO: should not be hardcoded.
        mutate("getCartItemsAndTotalCartPrice", getCartItemsAndTotalCartPrice()); // Q&A Is it okay to do mutate here? Or should I make a useState and change it to trigger render? A: Fake it or just keep pulling. In a real life application they will fake it.
        // await getCartItemsByCustomerUsername(util.getLoggedInCustomer().username); // TODO: Cart id should not be hardcoded!
    };

    const deleteCartItem = async (cartItem: CartItem) => {
        await CustomerService.deleteCartItem(cartItem.product.name);
        mutate("getCartItemsAndTotalCartPrice", getCartItemsAndTotalCartPrice());
        // await getCartItemsByCustomerUsername(util.getLoggedInCustomer().username);
    }

    const changeQuantity = async (cartItem: CartItem, change: string) => {
        await CustomerService.createOrUpdateCartItem(cartItem.product.name, change);
        mutate("getCartItemsAndTotalCartPrice", getCartItemsAndTotalCartPrice());
        // await getCartItemsByCustomerUsername(util.getLoggedInCustomer().username); // TODO: Cart id should not be hardcoded!
    };

    return (
        <>
            <Header highlightedTitle="Cart" />
            <main className={styles.main}>
                <>
                    {error && <p className="text-red-500 font-bold">{error}</p>}

                    {!error &&                    
                        <>
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
                    }

                </>
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

export default Cart;