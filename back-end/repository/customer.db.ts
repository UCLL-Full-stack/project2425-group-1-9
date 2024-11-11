import { Customer } from "../model/customer";
import database from "./database";

const getCustomerByUsername = async (username: string): Promise<Customer | null> => {
    try {
        const customerPrisma = await database.customer.findUnique({
            where: {
                username: username
            }
        });
        return customerPrisma ? Customer.from(customerPrisma) : null;
        
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
};

export default {
    getCustomerByUsername
};