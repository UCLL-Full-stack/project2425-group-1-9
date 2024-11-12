
import Link from "next/link";
import styles from "../styles/header.module.css";
import { useEffect, useState } from "react";


const Header: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<String | null>("");

  useEffect(() => {
    setLoggedInUser(sessionStorage.getItem("loggedInUser"));
  }, []);

  const logout = () => {
    sessionStorage.removeItem("loggedInUser");
    setLoggedInUser("");
  };

  return (
    <header className={styles.header}>
      <p className={styles.veso}>VESO</p>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        {loggedInUser && <Link href="/cart">Cart</Link>}
        {loggedInUser && <Link href="/profile">Profile</Link>}
        {!loggedInUser && <Link href="/login">Login</Link>}
        {loggedInUser && <Link href="#"><p onClick={logout}>Logout</p></Link>}
      </nav>
    </header>
  );
};

export default Header;