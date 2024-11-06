
import Link from "next/link";
import styles from "../styles/header.module.css";


const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <p className={styles.veso}>VESO</p>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/profile">Profile</Link>
      </nav>
    </header>
  );
};

export default Header;