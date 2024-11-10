import React, { useEffect } from 'react';
import type {  CartItem } from '../types';
import Image from 'next/image'

type Props = {
    cartItems: Array<CartItem>;
    // products: Array<Product>;
    // incrementQuantity: (productName: string) => void;
    // decrementQuantity: (productName: string) => void;
    // clearCart: () => void;
};

// const CartItem: React.FC<Props> = ({ cartItems, products, incrementQuantity, decrementQuantity, clearCart }: Props) => {
// const CartItem: React.FC<Props> = ({ cartItems, incrementQuantity, decrementQuantity, clearCart }: Props) => {
const CartItem: React.FC<Props> = ({ cartItems }: Props) => {
    // const getProduct = (name:string) => products.find(product => product.name === name);
    // console.log(products);

    // const print = () => {
    //     // console.log(cartItems[0]);
    // }

    // useEffect(() => {
    //     print();      
    //   });
    

    return (
        <>
            {cartItems.map((cartItem, index) => (
            // Assume that cartItem refers to product in the cart, meanwhile product refers to product in the product database.
                // console.log(cartItem);
                // console.log(cartItem.productName);
                // const product = getProduct(cartItem.product.name);
                // console.log(product);
                // return product ? (
                    <article key={index}>
                        <Image
                            src={cartItem.product.imagePath}
                            width={150} // this is changed in product.module.css
                            height={150}
                            alt={cartItem.product.name}
                        />
                        <div>
                            <p>{cartItem.product.name}</p>
                            <p>{cartItem.product.price} $ / {cartItem.product.unit}</p>
                            <p>Quantity: {cartItem.quantity}</p>
                            {/* <button onClick={() => incrementQuantity(item.product.name)}>+</button> */}
                            {/* <button onClick={() => decrementQuantity(item.product.name)}>-</button> */}
                        </div>       
                    </article>

                // ) : null;
            ))}
        </>
    );
};

export default CartItem;