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
            // setUsernameError("Username is required.");
            setUsernameError(t('login.valid.usernameError'));
            result = false;
        }

        if (!password || password.trim() === "") {
            // setPasswordError("Password is required.");
            setPasswordError(t('login.valid.passwordError'));
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
            // setStatusMessages([{message: `Redirecting...`, type: "success"}]);
            setStatusMessages([{message: t('login.handleSubmit.redirecting'), type: "success"}]);

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
            
            if (message === "Customer does not exist.") {
                setStatusMessages([{ message: t('login.handleSubmit.customerDoesNotExist'), type: 'error' }]);
            } else if (message === "Incorrect password.") {
                setStatusMessages([{ message: t('login.handleSubmit.incorrectPassword'), type: 'error' }]);
            }
        }

        else {
            setStatusMessages([
                {
                    // message: 'An error has occurred. Please try again later.',
                    message: t('login.handleSubmit.otherError'),
                    type: 'error'
                }
            ]);            
        }
    };

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

                {/* <p>Not logged in yet? <Link href={"/register"} className="underline text-blue-500">Register</Link></p> */}
                <p>{t('login.main.notLoggedInYet')} <Link href={"/register"} className="underline text-blue-500">{t('login.main.register')}</Link></p>

                <form onSubmit={(event) => handleSubmit(event)}>
                    <div>
                        {/* <label htmlFor="nameInput">Username: </label> */}
                        <label htmlFor="nameInput">{t('login.main.form.label.username')}</label>
                        <input 
                            type="text"
                            id="nameInput" 
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            />
                        {usernameError && <p>{t('login.main.form.label.usernameError')} {usernameError}</p>}
                    </div>
                    <div>
                        {/* <label htmlFor="passwordInput">Password: </label> */}
                        <label htmlFor="passwordInput">{t('login.main.form.label.password')}</label>
                        <input 
                            type={unhidePassword ? "text" : "password"}
                            id="passwordInput" 
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            />
                        {/* {passwordError && <p>Error: {passwordError}</p>} */}
                        {passwordError && <p>{t('login.main.form.passwordError')} {passwordError}</p>}
                        {/* <button type="button" onClick={() => setUnhidePassword(!unhidePassword)}>Just show that password</button> */}
                        <button type="button" onClick={() => setUnhidePassword(!unhidePassword)}>{t('login.main.form.button.showPassword')}</button>
                    </div>
                    <div>
                        {/* <input type="submit" value="Login!" /> */}
                        <input type="submit" value={t('login.main.form.submit')} />
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