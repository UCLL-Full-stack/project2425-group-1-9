// import bcrypt from 'bcrypt';
// import * as bcrypt from 'bcrypt';
import { Customer } from "../model/customer";
import customerDb from "../repository/customer.db";
import { AuthenticationResponse, CustomerInput } from "../types";
import { generateJwtToken } from "../util/jwt";

const getCustomerByUsername = async (username: string): Promise<Customer> => {
    const customer = await customerDb.getCustomerByUsername(username);
    if (!customer) throw new Error("Customer does not exist.");
    return customer;
};

const authenticate = async ({ username, password }: CustomerInput): Promise<AuthenticationResponse> => {
    const customer = await getCustomerByUsername(username);

    // const isValidPassword = await bcrypt.compare(password, user.password); // Q& 
    const isValidPassword = true;
    if (!isValidPassword) throw new Error("Incorrect password.");

    return {
        token: generateJwtToken({ username, role: customer.role }),
        username,
        fullname: `${customer.firstName} ${customer.lastName}`,
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

    // const hashedPassword = await bcrypt.hash(password, 12); // Q& 
    const hashedPassword = "123";
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