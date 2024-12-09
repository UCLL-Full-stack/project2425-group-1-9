import Image from 'next/image'
import type { CartItem, Product } from '../types';
import util from '@/util/util';


type Props = {
    products: Product[];
    cartItems: CartItem[];
    addToCart: (productName: string) => void;
};

const Product: React.FC<Props> = ({ products, cartItems, addToCart }: Props) => {

    const getQuantity = (productName: string) => {
        // console.log("Cart items", cartItems);

        try {
            // if (util.getLoggedInCustomer().username !== 'guest') {
            return cartItems.find((cartItem) => cartItem.product.name === productName)?.quantity || 0; // Q& Hydration failed
            // }
            // return null;
        } catch (error) {
            return null;
        }

    };

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
                        {util.getLoggedInCustomer().username !== 'guest' && <button onClick={() => addToCart(product.name)}>Add to cart</button>}
                        <p>Stock: {product.stock}</p>
                        {/* Quantity Increases without accessing actual value in the database. */}
                        {util.getLoggedInCustomer().username !== 'guest' && <p>Quantity: {getQuantity(product.name)}</p>}
                    </div>
                </article>
            ))}
        </>
    );
};

export default Product;