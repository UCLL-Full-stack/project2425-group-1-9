import Header from "@/components/header";
import { StatusMessage } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useInterval from "use-interval";

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const router = useRouter();

    const clearErrors  = () => {
        setUsernameError("");
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = false;

        if (!username && username.trim() === "") {
            setUsernameError("Username is required.");
            result = false;
        }

        return result;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        clearErrors();

        if (!validate) {
            return;
        }

        setStatusMessages([{message: `Redirecting...`, type: "success"}]);

        sessionStorage.setItem("loggedInUser", username);

        setTimeout(() => {
            router.push("/");
        }, 500);
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

                <form onSubmit={(event) => handleSubmit(event)}>
                    <div>
                        <label htmlFor="nameInput">Username: </label>
                        <input 
                            type="text"
                            id="nameInput" 
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            required />
                        {usernameError && <p>Error: {usernameError}</p>}
                    </div>
                    {/* <div>
                        <label htmlFor="passwordInput">Password: </label>
                        <input type="password" id="passwordInput" required />
                    </div> */}
                    <div>
                        <input type="submit" value="Login!" />
                    </div>
                </form>
            </main>
        </>
    );
};

export default Login;