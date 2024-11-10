import Image from 'next/image'
import { useState } from 'react';
import type { Product } from '../types';
import ProductService from '@/services/ProductService';
import CartItem from './cartItem';
// import CartService from '@/services/CartService';
import CustomerService from '@/services/CustomerSevice';


type Props = {
    products: Array<Product>;
};

const Product: React.FC<Props> = ({ products }: Props) => {
    // const [cartItems, setCartItems] = useState<Array<CartItem>>([]);
    
    // const addToCart = (product: Product) => {
    //     setCartItems(prevItems => {
    //         const existingItem = prevItems.find(item => item.product.name === product.name);
    //         if (existingItem) {
    //             return prevItems.map(item =>
    //                 // Rather use if. If have no clue what is going on.
    //                 item.product.name === product.name ? { ...item, quantity: (item.quantity??0) + 1 } : item
    //             );
    //         } else {
    //             return [...prevItems, { cartId: 1, productName: product.name, quantity: 1 }];
    //         }
    //     });
    // };

    // Functions that is called on click of 'Add to cart' button.
    const addToCartBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const productInfo = e.currentTarget.parentElement?.children;

        if (!productInfo) {
            throw new Error("Product info null.");
        }
    
        // Unhide hidden product info.
        for (let info of productInfo) {
            if (info.getAttribute("hidden") === "") {
                info.removeAttribute("hidden");
            }
        }

        // Increase the quantity.
        const quantityParagraph = productInfo[productInfo.length - 1];
        // Last child is the span element that contains the quantity number.

        const test = document.querySelector('header p')
        if (test) {
            test.textContent = test.textContent + "O";
        }
        
        
        // let currentQuantity = quantityParagraph.lastChild?.textContent;
        const quantitySpanElement = quantityParagraph.lastChild;
        if (quantitySpanElement) {
            const currentQuantity: number = Number(quantitySpanElement.textContent);
            const increasedQuantity: number = currentQuantity + 1;
            quantitySpanElement.textContent = String(increasedQuantity);
        }

        // Get the product name
        const productName = e.currentTarget.parentElement?.children[0].textContent ?? '';
        // console.log("Fetching product:", productName);
    
        // // Get the product from the database. TODO: SHOULD BE IN THE SERVICE!
        // try {
        //     const response = await ProductService.getProductByName(productName); // Q& Is this uppercase?
        //     if (!response.ok) {
        //         throw new Error(`Error fetching product: ${response.statusText}`);
        //     }
        //     const product: Product = await response.json();
        //     // Add the product to cart.
        //     addToCart(product);
        // } catch (error) {
        //     console.error("Failed to fetch product:", error);
        // }

        const customerUsername: string = "Matej333"; // TODO: should not be hardcoded.
        CustomerService.addCartItem(customerUsername, productName);
    };

    // const incrementQuantity = (productName: string) => {
    //     // setCartItems(prevItems =>
    //     //     prevItems.map(item =>
    //     //         item.productName === productName ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
    //     //     )
    //     // );
    // };
    // const decrementQuantity = (name: string) => {
    //     // setCartItems(prevItems =>
    //     //     prevItems.map(item =>
    //     //         item.productName === name ? { ...item, quantity: Math.max(item.quantity? - 1: 1) } : item
    //     //     )
    //     // );
    // };

    // const clearCart = () => {
    //     setCartItems([]);
    // };
        
    
    

    return (
        <>
            {products.map((product, index) => (
                <article key={index}>
                    <Image
                        src={product.imagePath}
                        width={150} // this is changed in product.module.css
                        height={150}
                        alt={product.name}
                        />
                    <div>
                        <p>{product.name}</p>
                        <p>{product.price} $ / {product.unit}</p>
                        <button onClick={(e) => addToCartBtn(e)}>Add to cart</button>
                        <p hidden >Stock: {product.stock}</p>
                        {/* Quantity Increases without accessing actual value in the database. */}
                        <p hidden>Quantity: <span>0</span></p>
                    </div>
                </article>
            ))}
        </>
    );
};

export default Product;