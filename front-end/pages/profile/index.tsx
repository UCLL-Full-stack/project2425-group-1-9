import Header from "@/components/header";
import { Customer } from "@/types";
import util from "@/util/util";

import { useEffect } from "react";

const Profile: React.FC = () => {
    // Highlight current tab in header.
    // const highlightCurrentTabInMenu = () => {
    //     const cartTabElement = document.querySelector("header nav a:nth-child(3)");
    //     if (cartTabElement) cartTabElement.setAttribute("style", "background-color: green;");
    // };


    // useEffect(() => {
    //     highlightCurrentTabInMenu();
    // }, []);

    return (
        <>
            <Header highlightedTitle="Profile"/>
            <main>
                <p>Welcome {util.getLoggedInCustomer().username}!</p>
            </main>
        </>
    );
};

export default Profile;