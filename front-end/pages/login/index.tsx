import Header from "@/components/header";
import CustomerService from "@/services/CustomerService";
import { StatusMessage } from "@/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useInterval from "use-interval";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Login: React.FC = () => {
    const { t } = useTranslation();

    const [username, setUsername] = useState("Matej333");
    const [usernameError, setUsernameError] = useState("");
    const [password, setPassword] = useState("m@t3j-v3s3l");
    const [passwordError, setPasswordError] = useState("");
    const [unhidePassword, setUnhidePassword] = useState<boolean>(false);
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const router = useRouter();

    const clearErrors  = () => {
        setUsernameError("");
        setPasswordError("");
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

        return result;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        clearErrors();

        if (!valid()) {
            return;
        }

        const customer = { username, password };
        const response = await CustomerService.loginCustomer(customer);

        if (response.status === 200) {
            setStatusMessages([{message: `Redirecting...`, type: "success"}]);

            const customer = await response.json();
            sessionStorage.setItem(
                'loggedInCustomer',
                JSON.stringify({
                    token: customer.token,
                    fullname: customer.fullname,
                    username: customer.username,
                    role: customer.role
                })
            );

            setTimeout(() => {
                router.push("/");
            }, 500);
        }

        else if (response.status === 401) {
            const { status, message } = await response.json();
            setStatusMessages([{ message, type: 'error' }]);
        }

        else {
            setStatusMessages([
                {
                    message: 'An error has occurred. Please try again later.',
                    type: 'error'
                }
            ]);            
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

                <p>Not logged in yet? <Link href={"/register"} className="underline text-blue-500">Register</Link></p>

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
                        <input type="submit" value="Login!" />
                    </div>
                </form>
            </main>
        </>
    );
};


export const getServerSideProps = async (context) => {
  const { locale } = context;

  return {
      props: {
          ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
  };
};

export default Login;