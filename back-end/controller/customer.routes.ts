/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      CartContainsProduct:
 *          type: object
 *          properties:
 *            productName:
 *              type: string
 *              description: Product's name.
 *            quantity:
 *              type: number
 *              format: int64
 *            cartId:
 *              type: number
 *              format: int64
 */

import express, { NextFunction, Request, Response } from 'express';
import { CartContainsProduct } from '../model/cartContainsProduct';
import cartService from '../service/cart.service';
// import cartService from '../service/cart.service';

const customerRouter = express.Router();

// /**
//  * @swagger
//  * /customers/{id}/cart/{productName}:
//  *   delete:
//  *     summary: Delete an item (product) from a cart using customer's username and product name.
//  *     parameters:
//  *          - in: path
//  *            name: id
//  *            schema:
//  *              type: string
//  *              required: true
//  *              description: Customer's ID.
//  *              example: 1
//  *          - in: path
//  *            name: productName
//  *            schema:
//  *              type: string
//  *              required: true
//  *              description: Product's name.
//  *              example: Bananas
//  *     responses:
//  *       200:
//  *         description: Message indicating success.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: string
//  */
// customerRouter.delete('/:id/cart/:productName', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const customerId: number = Number(req.params.id);
//         const productName: string = String(req.params.productName);
//         const result: string = await customerService.deleteCartItem({ customerId, productName });
//         res.json(result);
//         // res.status(200).json(result);   // DOES NOT WORK!!!!!!!! Q&
//     } catch (error) {
//         next(error);
//     }
// });

/**
 * @swagger
 * /customers/{username}/cart:
 *   delete:
 *     summary: Delete all items (products) from a cart using customer's username.
 *     parameters:
 *          - in: path
 *            name: username
 *            schema:
 *              type: string
 *              required: true
 *              description: Customer's username.
 *              example: Matej333
 *     responses:
 *       200:
 *         description: Message indicating success.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Cart items deleted successfully.
 */
customerRouter.delete('/:username/cart', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerUsername: string = String(req.params.username);
        const result: string = await cartService.deleteCartItemsByCustomerUsername(customerUsername);
        res.json(result);
        // res.status(200).json(result);   // DOES NOT WORK!!!!!!!! Q&
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /customers/{username}/cart/{productName}:
 *   post:
 *     summary: Add a product to a cart using customer's username and product name.
 *     parameters:
 *          - in: path
 *            name: username
 *            schema:
 *              type: string
 *              required: true
 *              description: Customer's username
 *              example: Matej333
 *          - in: path
 *            name: productName
 *            schema:
 *              type: string
 *              required: true
 *              description: Product's name.
 *              example: Bananas 
 *     responses:
 *       200:
 *         description: Message indicating success.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Product deleted successfully.
 */
customerRouter.post('/:username/cart/:productName', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerUsername: string = String(req.params.username);
        const productName: string = String(req.params.productName);
        const result = await cartService.addProductToCart(customerUsername, productName);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
})



/**
 * @swagger
 * /customers/{username}/cart:
 *   get:
 *     summary: Get CartContainsProduct objects using customer's username. (Get cart items of a customer).
 *     parameters:
 *          - in: path
 *            name: username
 *            schema:
 *              type: string
 *              required: true
 *              description: Customer's username.
 *              example: Matej333
 *     responses:
 *       200:
 *         description: A list of CartContainsProduct objects.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartContainsProduct'
 */
customerRouter.get("/:username/cart", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart: CartContainsProduct[] = await cartService.getCartItemsByCustomerUsername(String(req.params.username));
        res.status(200).json(cart);
    } catch (e) {
        next(e);
    }


})



export { customerRouter };
