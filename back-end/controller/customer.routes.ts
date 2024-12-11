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
 *      OrderInput:
 *          type: object
 *          properties:
 *              date:
 *                  type: date-time
 *                  format: date-time
 *              customer:
 *                  type: object
 *                  properties:
 *                      username:
 *                          type: string     
 *      CustomerInput:
 *          type: object
 *          properties:
 *              password:
 *                  type: string
 *                  description: Customer's password.
 *                  example: m@t3j-v3s3l
 *              securityQuestion:
 *                  type: string
 *                  description: Customer's security question.
 *                  example: What is the name of the best friend from childhood?
 *              username:
 *                  type: string
 *                  description: Customer's username.
 *                  example: Matej444
 *              firstName:
 *                  type: string
 *                  description: Customer's first name.
 *                  example: Matej
 *              lastName:
 *                  type: string
 *                  description: Customer's last name.
 *                  example: Vesel
 *              phone:
 *                  type: number
 *                  format: int64
 *                  example: 12345678
 *              role:
 *                  type: string
 *                  description: Customer's role. Can be either 'customer', 'admin' or 'guest'.
 *                  example: customer
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
 *      AuthenticationRequest:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *                  description: Customer's username
 *                  example: Matej333
 *              password:
 *                  type: string
 *                  description: Customer's password
 *                  example: m@t3j-v3s3l
 *      AuthenticationResponse:
 *          type: object
 *          properties:
 *              token:
 *                  type: string
 *                  description: Customer's token.
 *              username:
 *                  type: string
 *                  description: Customer's username.
 *              fullname:
 *                  type: string
 *                  description: Customer's fullname.
 *              
 *              
 *          
 *              
 */


import express, { NextFunction, Request, Response } from 'express';
import { expressjwt, Request as JWTRequest } from "express-jwt";
import { CartContainsProduct } from '../model/cartContainsProduct';
import cartItemService from '../service/cartItem.service';
import cartService from '../service/cart.service';
import { CustomerInput, Role } from '../types';
import customerService from '../service/customer.service';

const customerRouter = express.Router();

/**
 * @swagger
 * /customers/{username}/cart/{productName}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete an item from a cart.
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
 */
customerRouter.delete('/:username/cart/:productName', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // AUTHENTICATION. Q&A Because I get username from the authentication token, is the username request parameter redundant? A: Yes.
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username: customerUsername, role } = request.auth;

        // const customerUsername: string = String(req.params.username);
        const productName: string = String(req.params.productName);
        
        const result: string = await cartItemService.deleteCartItemByCustomerUsernameAndProductName(customerUsername, productName);
        res.json(result);
        // res.status(200).json(result);   // DOES NOT WORK!!!!!!!! Q&
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /customers/{username}/cart:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete all items (products) from a cart.
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
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username: customerUsername, role } = request.auth;

        const result: string = await cartItemService.deleteCartItemsByCustomerUsername(customerUsername);
        res.json(result);
        // res.status(200).json(result);   // DOES NOT WORK!!!!!!!! Q&
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /customers/{username}/cart/{productName}?change:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     summary: Add a product to cart or change it's quantity.
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
 *          - in: query
 *            name: change
 *            schema:
 *              type: string
 *              required: false
 *              description: Specify whether to 'increase' or 'decrease' the cart item.
 *              example: decrease
 *     responses:
 *       200:
 *         description: Message indicating success.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Product deleted successfully.
 */
customerRouter.put('/:username/cart/:productName', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const customerUsername: string = String(req.params.username);

        const request = req as Request & { auth: { username: string; role: Role } };
        const { username: customerUsername, role } = request.auth;

        const productName: string = String(req.params.productName);
        const change: string = String(req.query.change) || "increase";

        const result = await cartItemService.createOrUpdateCartItem(customerUsername, productName, change);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
})
// https://www.baeldung.com/rest-http-put-vs-post





/**
 * @swagger
 * /customers/{username}/cart:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get cart items of a customer. (Get CartContainsProduct objects using customer's username.)
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
// customerRouter.get("/:username/cart", async (req: Request, res: Response, next: NextFunction) => {
// customerRouter.get('/:username/cart', async (req: JWTRequest, res: Response, next: NextFunction) => {
customerRouter.get('/:username/cart', async (req: Request, res: Response, next: NextFunction) => {
    try {    
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;

        const cart: CartContainsProduct[] = await cartItemService.getCartItemsByCustomerUsername(username);
        res.status(200).json(cart);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /customers/{username}/cart/totalPrice:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get total price of a cart.
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
 *         description: Total price of the cart.
 *         content:
 *           application/json:
 *             type: number
 *             example: 500
 */
customerRouter.get("/:username/cart/totalPrice", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;

        const totalCartPrice: number = await cartService.getTotalCartPriceByCustomerUsername(username);
        res.status(200).json(totalCartPrice);
    } catch (e) {
        next(e);
    }
});


// /**
//  * @swagger
//  * /customers/{username}/cart/order/{date}:
//  *   post:
//  *     security:
//  *      - bearerAuth: []
//  *     summary: Create (place) an order. Better alternative to /order.
//  *     parameters:
//  *          - in: path
//  *            name: username
//  *            schema:
//  *              type: string
//  *              required: true
//  *              description: Customer's username
//  *              example: Matej333
//  *          - in: path
//  *            name: date
//  *            schema:
//  *              type: string
//  *              format: date-time
//  *              required: true
//  *              description: Order's date.
//  *              example: 2019-01-19 14:00:12
//  *     responses:
//  *       200:
//  *         description: Message indicating success.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: string
//  *               example: Order placed successfully.
//  */
// customerRouter.post('/:username/cart/order/:date', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const customerUsername: string = String(req.params.username);
//         const date: string = String(req.params.date);

//         const order: OrderInput = { 
//             customer: { username: customerUsername },
//             date: new Date(date)
//         };

//         const result = await orderService.createOrder(order);
//         res.status(200).json(result);

//     } catch (error) {
//         next(error);
//     }
// })


/**
 * @swagger
 * /customers/register:
 *  post:
 *      summary: Create a customer.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CustomerInput'
 *      responses:
 *          200:
 *              description: The created customer object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Customer'
 */
customerRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerInput = <CustomerInput>req.body;
        const customer = await customerService.createCustomer(customerInput);
        res.status(200).json(customer);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /customers/login:
 *  post:
 *      summary: Login using username and password. Returns an object with JWT token and user name when successful.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AuthenticationRequest'
 *      responses:
 *          200:
 *              description: The created customer object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AuthenticationResponse'
 *          401:
 *              description: Error indicating wrong password.
 *              content:
 *                  application/json:
 *                      schema:
 *                          string: Wrong credentials.
 */
customerRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerInput = <CustomerInput>req.body;
        const response = await customerService.authenticate(customerInput);
        res.status(200).json({ message: "Authentication successful.", ...response});
    } catch (error) {
        next(error);
    }
});

export { customerRouter };

// Q&A Do we need to have functionality to register sb in the system via front-end? A: yes.
// Q&A • OK There is at least 1 functional form with validation, error handling and integration with the back-end. • There is at least 1 login form with validation and error handling.  A: You need two forms.
// TODO always return the object. It is a contract.