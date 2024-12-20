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
 *      Order:
 *          type: object
 *          properties:
 *              cart:
 *                  $ref: '#/components/schemas/Cart'
 *              date:
 *                  type: string
 *                  format: date-time
 *              customer:
 *                  $ref: '#/components/schemas/Customer' 
 *      Cart:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *                  format: int64
 *                  example: 1
 *              totalPrice:
 *                  type: number
 *                  format: int64
 *                  example: 50
 *              active:
 *                  type: boolean
 *                  example: true
 *              customer:
 *                  $ref: '#/components/schemas/Customer'
 *      Customer:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *                  format: int64
 *              password:
 *                  type: string
 *                  description: Customer's password.
 *              securityQuestion:
 *                  type: string
 *                  description: Customer's security question.
 *              username:
 *                  type: string
 *                  description: Customer's username.
 *              firstName:
 *                  type: string
 *                  description: Customer's first name.
 *              lastName:
 *                  type: string
 *                  description: Customer's last name.
 *              phone:
 *                  type: number
 *                  format: int64
*              role:
 *                  type: string
 *                  description: Customer's role. Can be either 'customer', 'admin' or 'guest'.
 *                  example: customer
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
 *               $ref: '#/components/schemas/Order'
 */
orderRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // AUTHENTICATE. Q&A What happens here? User input: JWT (contains username and role) and username. Backend takes the given username and corresponding password in the database, generates another token and sees if the tokens match?
        const request = req as Request & { auth: { username: string; role: Role } };

        // Add authentication info to the request body. Q&A Is this the correct way? Authorization.pptx slide 4. A: Yes, or you can add another parameter to the createOrder.
        const order = <OrderInput>req.body;
        order.auth = request.auth;

        const result = await orderService.createOrder(order);

        res.status(200).json({ message: result });
    } catch (error) {
        next(error);
    }
})
// Q&A Do we have to always return an object in result. Is just a plain string okay? A: Don't return string. 
// TODO This endpoint should be under customer and not using request body.

export { orderRouter };