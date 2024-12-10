import bcrypt from 'bcrypt';
// import * as bcrypt from 'bcrypt';
import { Customer } from "../model/customer";
import customerDb from "../repository/customer.db";
import { AuthenticationResponse, CustomerInput } from "../types";
import { generateJwtToken } from "../util/jwt";
import { UnauthorizedError } from 'express-jwt';

const getCustomerByUsername = async (username: string): Promise<Customer> => {
    const customer = await customerDb.getCustomerByUsername(username);
    if (!customer) throw new UnauthorizedError('invalid_token', {message: 'Customer does not exist.'});
    return customer;
};

const authenticate = async ({ username, password }: CustomerInput): Promise<AuthenticationResponse> => {
    const customer = await getCustomerByUsername(username);

    const isValidPassword = await bcrypt.compare(password, customer.password);
    if (!isValidPassword) throw new UnauthorizedError('invalid_token', {message: 'Incorrect password'});

    return {
        token: generateJwtToken({ username, role: customer.role }),
        username,
        fullname: `${customer.firstName} ${customer.lastName}`,
        role: customer.role
    };
};

// TODO test.
const createCustomer = async ({
    password,
    securityQuestion,
    username,
    firstName,
    lastName,
    phone,
    role
}: CustomerInput):  Promise<Customer> => {
    const existingCustomer = await customerDb.getCustomerByUsername(username); // TODO he uses types. { username }
    if (existingCustomer) throw new Error("Customer is already registered.");

    // TODO add phone field validation.

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const customer = new Customer({ 
        password: hashedPassword,
        securityQuestion,
        username,
        firstName,
        lastName,
        phone,
        role
     });

     return await customerDb.createCustomer(customer);

};

export default {
    createCustomer,
    authenticate
};