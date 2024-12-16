import type {  CartItem } from '../types';
import Image from 'next/image'
import styles from "../styles/Home.module.css";

type Props = {
    cartItems: Array<CartItem>;
    changeQuantity: (cartItem: CartItem, change: string) => void;
    deleteCartItem: (cartItem: CartItem) => void;
};

// TODO rename components.
const CartItem: React.FC<Props> = ({ cartItems, changeQuantity, deleteCartItem }: Props) => { 

    return (
        <>
        {cartItems.map((cartItem, index) => (
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
                        <p>Stock: {cartItem.product.stock}</p>
                        <div className={styles.changeQuantityDiv}>
                            <button onClick={() => changeQuantity(cartItem, "increase")}>+</button>
                            <button onClick={() => changeQuantity(cartItem, "decrease")}>-</button>
                        </div>
                        <button onClick={() => deleteCartItem(cartItem)}>DELETE</button>
                        <p>Price: {cartItem.product.price * cartItem.quantity} $</p>
                        <p>Quantity: {cartItem.quantity}</p>
                    </div>       
                </article>
            ))}
        </>
    );
};

export default CartItem;