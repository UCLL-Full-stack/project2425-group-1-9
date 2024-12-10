/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      OrderInput:
 *          type: object
 *          properties:
 *              date:
 *                  type: string
 *                  format: date-time
 *              customer:
 *                  type: object
 *                  properties:
 *                      username:
 *                          type: string   
 *                          example: Matej333         
 */

import express, { NextFunction, Request, Response } from 'express';
import orderService from '../service/order.service';
import { OrderInput, Role } from '../types';

const orderRouter = express.Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Create (place) an order.
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       200:
 *         description: Message indicating success.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Order placed successfully.
 */
orderRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // AUTHENTICATE. Q&A What happens here? User input: JWT (contains username and role) and username. Backend takes the given username and corresponding password in the database, generates another token and sees if the tokens match?
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;

        // Add authentication info to the request body. Q&A Is this the correct way? Authorization.pptx slide 4. A: Yes, or you can add another parameter to the createOrder.
        const order = <OrderInput>req.body;
        if (order.customer) {
            order.customer.username = username;
        }

        // Delegate the request.
        const result = await orderService.createOrder(order);

        res.status(200).json({ message: result });
    } catch (error) {
        next(error);
    }
})
// Q&A Do we have to always return an object in result. Is just a plain string okay? A: Don't return string. 
// TODO This endpoint should be under customer and not using request body.

export { orderRouter };