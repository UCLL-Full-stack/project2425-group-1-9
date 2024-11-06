import { Product } from "../model/product";
import productDb from "../repository/product.db";

const getAllProducts = async (): Promise<Product[]> => {
    return await productDb.getAllProducts();
}

const getProductByName = async (name: string): Promise<Product> => {
    const product: Product | null = await productDb.getProductByName(name);
    if (!product) throw new Error(`Product "${name}" does not exist.`);
    return product;
}

export default {
    getAllProducts,
    getProductByName
};