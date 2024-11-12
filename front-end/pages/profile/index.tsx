import Header from "@/components/header";
import { useEffect } from "react";

const Profile: React.FC = () => {
    // Highlight current tab in header.
    const highlightCurrentTabInMenu = () => {
        const cartTabElement = document.querySelector("header nav a:nth-child(3)");
        if (cartTabElement) cartTabElement.setAttribute("style", "background-color: green;");
    };

    useEffect(() => {
        highlightCurrentTabInMenu();
    }, []);

    return (
        <>
            <Header />
            <main>
                <p>Welcome {sessionStorage.getItem("loggedInUser")}!</p>
            </main>
        </>
    );
};

export default Profile;