/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      Product:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *              description: Product's name.
 *            price:
 *              type: number
 *              format: int64
 *            unit:
 *              type: string
 *              description: Product's unit (kg, L, piece,...).
 *            stock:
 *              type: number
 *              format: int64
 *            description:
 *              type: string
 *              description: Product's description.
 */
import express, { NextFunction, Request, Response } from 'express';
import { Product } from '../model/product';
import productService from '../service/product.service';

const productRouter = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get a list of all products.
 *     responses:
 *          200:
 *              description: A list of all products.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 */
productRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products: Product[] = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /products/{name}:
 *   get:
 *     summary: Get a product by its name.
 *     parameters:
 *          - in: path
 *            name: name
 *            schema:
 *              type: string
 *              required: true
 *              description: The name of the product.
 *              example: Bread
 *     responses:
 *       200:
 *         description: A product object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
productRouter.get('/:name', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product: Product | null = await productService.getProductByName(String(req.params.name));
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

export { productRouter };