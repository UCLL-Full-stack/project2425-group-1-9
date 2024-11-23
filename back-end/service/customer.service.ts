// import bcrypt from 'bcrypt';
// import * as bcrypt from 'bcrypt';
import { Customer } from "../model/customer";
import customerDb from "../repository/customer.db";
import { CustomerInput } from "../types";

const createCustomer = async ({
    password,
    securityQuestion,
    username,
    firstName,
    lastName,
    phone
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
        phone
     });

     return await customerDb.createCustomer(customer);

};

export default {
    createCustomer
};