import Header from "@/components/Header";
import CustomerService from "@/services/CustomerService";
import OrderService from "@/services/OrderService";
import { Orderr } from "@/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useRouter } from "next/router";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";


const Order: React.FC = () => {
    const [error, setError] = useState<string>("");

    // const getCustomerUsername = () => sessionStorage.getItem("loggedInUser") || "guest";

    const [firstName, setFirstName] = useState("Matej");
    const [firstNameError, setFirstNameError] = useState("");

    const [lastName, setLastName] = useState("Vesel");
    const [lastNameError, setLastNameError] = useState("");

    const [phone, setPhone] = useState("00 32 455 23 532");
    const [phoneError, setPhoneError] = useState("");

    const [statusMessage, setStatusMessage] = useState("");

    const router = useRouter();

    const getTotalCartPrice = async () => {
        const responses = Promise.all([
            CustomerService.getTotalCartPriceByCustomerUsername()
        ]);

        const [totalCartPriceResponse] = await responses;

        if (!totalCartPriceResponse.ok) {
            if (totalCartPriceResponse.status === 401) {
                setError("You are not authorized to access this resource.");
            } else {
                setError(totalCartPriceResponse.statusText);
            };

            return;
        }

        const totalCartPrice = await totalCartPriceResponse.json();

        return {
            totalCartPrice
        };
    };

    const { data, isLoading } = useSWR(
        "getTotalCartPrice",
        getTotalCartPrice
    );

    useInterval(() => {
        mutate("getTotalCartPrice", getTotalCartPrice());
    }, 5000);


    const clearErrors = () => {
        setFirstNameError("");
        setLastNameError("");
        setPhoneError("");
    };

    const valid = (): boolean => {
        let result = true;

        if (!firstName || !firstName.trim()) {
            setFirstNameError("First name is required.");
            result = false;
        };

        if (!lastName || !lastName.trim()) {
            setLastNameError("Last name is required.");
            result = false;
        };

        const phoneRegex = new RegExp(String.raw`^00(\s[1-9][0-9]+){2,}$`);
        if (!phone || !phone.trim()) {
            setPhoneError("Phone number is required.");
            result = false;
        } else if (!phone.match(phoneRegex)) {
            setPhoneError("Invalid format.");
            result = false;
        }   

        return result;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        clearErrors();

        if (!valid()) {
            return;
        };

        // const date: Date = new Date(Date.now());
        const date: Date = new Date("2024-01-19 14:00:12");
        const order: Orderr = { date };
        const response = await OrderService.placeOrder(order);
        if (response.status === 200) setStatusMessage("Order placed successfully.");
        if (response.status !== 200) {
            const { message } = await response.json();
            setStatusMessage(message);
        }
        
        mutate("getTotalCartPrice", getTotalCartPrice());

    };

    return (
        <>
            <Header highlightedTitle="Cart"/>

            <main>
                {error && <p className="text-red-500 font-bold">{error}</p>}

                {!error &&                    
                    <form onSubmit={(e) => handleSubmit(e)}>
                        {/* <div>
                            <label htmlFor="firstNameInput">First name:</label>
                            <input type="text" id="firstNameInput" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                            {firstNameError && <p>{firstNameError}</p>}
                        </div>

                        <div>
                            <label htmlFor="lastNameInput">Last name:</label>
                            <input type="text" id="lastNameInput" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                            {lastNameError && <p>{lastNameError}</p>}
                        </div>

                        <div>
                            <label htmlFor="phoneNameInput">Phone:</label>
                            <input type="text" id="phoneNameInput" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="00 32 285 56 12 64"/>
                            {phoneError && <p>{phoneError}</p>}
                        </div> */}

                        <div>
                            {data && <p>Total price: {data.totalCartPrice}</p>}
                        </div>

                        <div>
                            <input type="submit" value="Place order"/>
                            {statusMessage && <p>{statusMessage}</p>}
                        </div>
                    </form>
                }
            </main>
        </>
    );
};

// Q& Type?
export const getServerSideProps = async (context) => {
  const { locale } = context;

  return {
      props: {
          ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
  };
};

export default Order;