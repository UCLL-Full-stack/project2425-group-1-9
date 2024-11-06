import React from 'react';
import type {  CartItem, Product } from '../types';
import Image from 'next/image'

type CartProps = {
    cartItems: Array<CartItem>;
    products: Array<Product>;
    incrementQuantity: (productName: string) => void;
    decrementQuantity: (productName: string) => void;
    clearCart: () => void;
};

const CartItem: React.FC<CartProps> = ({ cartItems, products, incrementQuantity, decrementQuantity, clearCart }: CartProps) => {
    const getProduct = (name:string) => products.find(product => product.name === name);
    // console.log(products);

    return (
        <>
            {cartItems.map((item, index) => {
            // Assume that item refers to product in the cart, meanwhile product refers to product in the product database.
                // console.log(item);
                // console.log(item.productName);
                const product = getProduct(item.productName);
                // console.log(product);
                return product ? (
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
                            <p>Quantity: {item.quantity}</p>
                            <button onClick={() => incrementQuantity(item.productName)}>+</button>
                            <button onClick={() => decrementQuantity(item.productName)}>-</button>
                        </div>       
                    </article>

                ) : null;
            })}
        </>
    );
};

export default CartItem;