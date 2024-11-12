import Image from 'next/image'
import type { CartItem, Product } from '../types';


type Props = {
    products: Product[];
    cartItems: CartItem[];
    addToCart: (productName: string) => void;
};

const Product: React.FC<Props> = ({ products, cartItems, addToCart }: Props) => {

    const getQuantity = (productName: string) => {
        return cartItems.find((cartItem) => cartItem.product.name === productName)?.quantity || 0;
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
                        {sessionStorage.getItem("loggedInUser") && <button onClick={() => addToCart(product.name)}>Add to cart</button>}
                        <p>Stock: {product.stock}</p>
                        {/* Quantity Increases without accessing actual value in the database. */}
                        {sessionStorage.getItem("loggedInUser") && <p>Quantity: {getQuantity(product.name)}</p>}
                    </div>
                </article>
            ))}
        </>
    );
};

export default Product;