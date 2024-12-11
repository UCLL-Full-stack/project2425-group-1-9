import Header from "@/components/header";
import CustomerService from "@/services/CustomerService";
import { StatusMessage } from "@/types";
import util from "@/util/util";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useInterval from "use-interval";

const Login: React.FC = () => {
    const [username, setUsername] = useState("Matej444");
    const [usernameError, setUsernameError] = useState("");
    const [password, setPassword] = useState("m@t3j-v3s3l");
    const [passwordError, setPasswordError] = useState("");
    const [unhidePassword, setUnhidePassword] = useState<boolean>(false);
    const [securityQuestion, setSecurityQuestion] = useState("What is the name of the best friend from childhood?");
    const [securityQuestionError, setSecurityQuestionError] = useState("");
    const [firstName, setFirstName] = useState("Matej");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastName, setLastName] = useState("Vesel");
    const [lastNameError, setLastNameError] = useState("");
    const [phone, setPhone] = useState<number>(123456789);
    const [phoneError, setPhoneError] = useState("");
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    
    const router = useRouter();

    const clearErrors  = () => {
        setUsernameError("");
        setPasswordError("");
        setSecurityQuestionError("");
        setFirstNameError("");
        setLastNameError("");
        setPhoneError("");
        setStatusMessages([]);
    };

    const valid = (): boolean => {
        let result = true;

        if (!username || username.trim() === "") {
            setUsernameError("Username is required.");
            result = false;
        }

        if (!password || password.trim() === "") {
            setPasswordError("Password is required.");
            result = false;
        }

        if (!securityQuestion || securityQuestion.trim() === "") {
            setPasswordError("Security question is required.");
            result = false;
        }

        if (!firstName || firstName.trim() === "") {
            setPasswordError("First name is required.");
            result = false;
        }

        if (!lastName || lastName.trim() === "") {
            setPasswordError("Last name is required.");
            result = false;
        }

        if (!phone) {
            setPasswordError("Phone is required.");
            result = false;
        }

        return result;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        clearErrors();

        if (!valid()) {
            return;
        }

        const customer = { username, password, securityQuestion, firstName, lastName, phone, role: 'customer' };
        const response = await CustomerService.registerCustomer(customer);

        if (response.status === 200) {
            setStatusMessages([{message: `Registered successfully. Redirecting to login page...`, type: "success"}]);


            setTimeout(() => {
                router.push("/login");
            }, 1000);
        }

        else if (response.status === 401) {
            const { status, message } = await response.json();
            setStatusMessages([{ message, type: 'error' }]);
        }

        else {
            const { status, message } = await response.json();
            setStatusMessages([{ message, type: 'error' }]);          
        }
    };

    // // Highlight current tab in header.
    // const highlightCurrentTabInMenu = () => {
    //     const cartTabElement = document.querySelector("header nav a:nth-child(2)");
    //     if (cartTabElement) cartTabElement.setAttribute("style", "background-color: green;");
    // };

    // useEffect(() => {
    //     highlightCurrentTabInMenu();
    // }, []);


    return (
        <>
            <Header highlightedTitle="Login"/>
            <main>

                {util.getLoggedInCustomer().username !== 'guest' && <p className="text-red-500 font-bold">You are not authorized to access this resource.</p>}

                {util.getLoggedInCustomer().username === 'guest' &&

                    <>

                        {statusMessages && (
                            <section>
                                <ul>
                                    {statusMessages.map(({ message, type}, index) => (
                                        <li 
                                            key={index}
                                            // className={classNames({
                                            //     "text-red-800": type === "error",
                                            //     "text-green-800": type === "success",
                                            // })}
                                        >
                                            {message}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <p>Registration Form</p>

                        <form onSubmit={(event) => handleSubmit(event)}>


                            <div>
                                <label htmlFor="nameInput">Username: </label>
                                <input 
                                    type="text"
                                    id="nameInput" 
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    />
                                {usernameError && <p>Error: {usernameError}</p>}
                            </div>


                            <div>
                                <label htmlFor="passwordInput">Password: </label>
                                <input 
                                    type={unhidePassword ? "text" : "password"}
                                    id="passwordInput" 
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    />
                                {passwordError && <p>Error: {passwordError}</p>}
                                <button type="button" onClick={() => setUnhidePassword(!unhidePassword)}>Just show that password</button>
                            </div>


                            <div>
                                <label htmlFor="securityQuestionInput">Security Question: </label>
                                <input 
                                    type="text"
                                    id="securityQuestionInput" 
                                    value={securityQuestion}
                                    onChange={(event) => setSecurityQuestion(event.target.value)}
                                    />
                                {securityQuestionError && <p>Error: {securityQuestionError}</p>}
                            </div>


                            <div>
                                <label htmlFor="firstNameInput">First name: </label>
                                <input 
                                    type="text"
                                    id="firstNameInput" 
                                    value={firstName}
                                    onChange={(event) => setFirstName(event.target.value)}
                                    />
                                {firstNameError && <p>Error: {firstNameError}</p>}
                            </div>


                            <div>
                                <label htmlFor="lastNameInput">Last name: </label>
                                <input 
                                    type="lastName"
                                    id="lastNameInput" 
                                    value={lastName}
                                    onChange={(event) => setLastName(event.target.value)}
                                    />
                                {lastNameError && <p>Error: {lastNameError}</p>}
                            </div>


                            <div>
                                <label htmlFor="phoneInput">Phone: </label>
                                <input 
                                    type="phone"
                                    id="phoneInput" 
                                    value={phone}
                                    onChange={(event) => setPhone(Number(event.target.value))}
                                    />
                                {phoneError && <p>Error: {phoneError}</p>}
                            </div>


                            <div>
                                <input type="submit" value="Register!" />
                            </div>
                        </form>
                    </>
                }   
            </main>
        </>
    );
};

export default Login;