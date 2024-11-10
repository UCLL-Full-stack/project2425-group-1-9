import { Customer } from "../model/customer";
import database from "./database";

// const customers: Customer[] = [
//     new Customer({
//         id: 1,
//         password: "m@t3j-v3s3l",
//         securityQuestion: "What is the name of the best friend from childhood?", // TODO: We also need security answer. It may also be a list.
//         username: "Matej333",
//         firstName: "Matej",
//         lastName: "Vesel",
//         phone: 333444555666
//     }),
//     new Customer({
//         id: 2,
//         password: "r0l@nd-d1m3-",
//         securityQuestion: "What is the name of the best friend from childhood?", // TODO: We also need security answer. It may also be a list.
//         username: "Roland333",
//         firstName: "Roland",
//         lastName: "Ndime Sone",
//         phone: 333444555666
//     })
// ];

// const getCustomerById = (id: number | undefined): Customer | null => {
//     return customers.find((customer) => customer.getId() === id) || null;
// }


// const getCustomerByUsername = (username: string | undefined): Customer | null => {
//     return customers.find((customer) => customer.getUsername() === username) || null;
// }

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
    // getCustomerById,
    getCustomerByUsername
};