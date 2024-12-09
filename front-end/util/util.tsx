import { Customer } from "@/types";

const getLoggedInCustomer = (): Customer => {
  try {
    let loggedInCustomer: Customer | string | null = sessionStorage.getItem('loggedInCustomer');
    if (loggedInCustomer) {
      loggedInCustomer = JSON.parse(loggedInCustomer) as Customer;
    } else {
      loggedInCustomer = { username: 'guest', role: 'guest' } as Customer; 
    }
  
    return loggedInCustomer;

  } catch (error) {
      return { username: 'guest', role: 'guest' } as Customer; // Q& After adding this try catch, I got hydration failed error. Before it complained that session storage is not defined.
  }

}

const Util = {
 getLoggedInCustomer
};

export default Util;

