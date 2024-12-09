
import Link from "next/link";
import styles from "../styles/header.module.css";
import { useEffect, useState } from "react";
import { Customer, HighlightedTitle } from "@/types";
import util from "@/util/util";


type HeaderProps = {
  highlightedTitle: HighlightedTitle;
};

// const Product: React.FC<Props> = ({ products, cartItems, addToCart }: Props) => {

const Header: React.FC<HeaderProps> = ({ highlightedTitle }) => {
  const [loggedInUser, setLoggedInUser] = useState<String>('guest');

//   const getLoggedInCustomer = (): Customer => {
//     let loggedInCustomer: Customer | string | null = sessionStorage.getItem('loggedInCustomer');
//     if (loggedInCustomer) {
//       loggedInCustomer = JSON.parse(loggedInCustomer) as Customer;
//     } else {
//       loggedInCustomer = { username: 'guest', role: 'guest' } as Customer; 
//     }

//     return loggedInCustomer;
// }

  useEffect(() => {
    // console.log(loggedInUser);
    setLoggedInUser(util.getLoggedInCustomer().username);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("loggedInCustomer");
    // setLoggedInUser("guest");
    setLoggedInUser('guest');
  };

  return (
    <header className={styles.header}>
      <p className={styles.veso}>VESO</p>
      <nav className={styles.nav}>
        <Link 
          className={highlightedTitle === "Home" ? "bg-[#008000]" : ""}
          href="/">Home
        </Link>

        {loggedInUser !== 'guest' && 
          <Link 
            className={highlightedTitle === "Cart" ? "bg-[#008000]" : ""}
            href="/cart" >Cart
          </Link>}

        {loggedInUser !== 'guest' && 
          <Link 
            className={highlightedTitle === "Profile" ? "bg-[#008000]" : ""}
            href="/profile">Profile
          </Link>}

        {loggedInUser === 'guest'  && 
          <Link 
            className={highlightedTitle === "Login" ? "bg-[#008000]" : ""}
            href="/login">Login
            </Link>}

        {loggedInUser !== 'guest' && 
          <Link 
            className={highlightedTitle === "Logout" ? "bg-[#008000]" : ""}
            href="#"><p onClick={logout}>Logout</p>
          </Link>}
        {/* <p 
          className={highlightedTitle === "cart" ? "text-black" : ""}>
          test
        </p> */}
      </nav>
    </header>
  );
};

export default Header;