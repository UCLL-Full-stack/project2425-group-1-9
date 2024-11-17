import Header from "@/components/header";
import CustomerService from "@/services/CustomerService";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Order: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState("");

    const [lastName, setLastName] = useState("");
    const [lastNameError, setLastNameError] = useState("");

    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const [statusMessage, setStatusMessage] = useState("");

    const router = useRouter();
    const { totalPrice } = router.query;

    

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

        setStatusMessage(await CustomerService.placeOrder());

    };

    // Highlight current tab in header.
    const highlightCurrentTabInMenu = () => {
        const cartTabElement = document.querySelector("header nav a:nth-child(2)");
        if (cartTabElement) cartTabElement.setAttribute("style", "background-color: green;");
    };

    useEffect(() => {
        highlightCurrentTabInMenu();
    }, []);

    return (
        <>
            <Header />

            <main>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div>
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
                    </div>

                    <div>
                        <p>Total price: {totalPrice}</p>
                    </div>

                    <div>
                        <input type="submit" value="Place order"/>
                        {statusMessage && <p>{statusMessage}</p>}
                    </div>
                </form>
            </main>
        </>
    );
};

export default Order;