
import Link from "next/link";
import { useEffect, useState } from "react";
import { Customer, HighlightedTitle } from "@/types";
import util from "../util/util";
import Language from "./Language";
import { useTranslation } from "next-i18next";

type HeaderProps = {
  highlightedTitle: HighlightedTitle;
};

const Header: React.FC<HeaderProps> = ({ highlightedTitle }) => {

  const [loggedInUser, setLoggedInUser] = useState<string>('guest');
  const [quote, setQuote] = useState<string>('');

  useEffect(() => {
    // console.log(loggedInUser);
    setLoggedInUser(util.getLoggedInCustomer().username);
    setQuote(sessionStorage.getItem('quote') || '');
  }, []);

  useEffect(() => {

  }, [quote]);

  const logout = () => {
    sessionStorage.removeItem("loggedInCustomer");
    setLoggedInUser('guest');
  };

  const getQuote = (): string => {
    return sessionStorage.getItem('quote') || '';
  };

  const { t } = useTranslation();

  return (
    <>
  
    <header className="text-white bg-[green] flex">
      <p className="flex-[0.6] text-center">VESO</p>
      <nav className="bg-[red] flex flex-[2] justify-around flex-wrap">
        <Link 
          className={highlightedTitle === "Home" ? "bg-[green]" : ""}
          href="/">{t('header.nav.home')}
        </Link>

        {(!['guest', 'admin'].includes(loggedInUser)) && 
          <Link 
            className={highlightedTitle === "Cart" ? "bg-[green]" : ""}
            href="/cart" >{t('header.nav.cart')}
          </Link>}

        {loggedInUser !== 'guest' && 
          <Link 
            className={highlightedTitle === "Profile" ? "bg-[green]" : ""}
            href="/profile">{t('header.nav.profile')}
          </Link>}

        {loggedInUser === 'guest'  && 
          <Link 
            className={highlightedTitle === "Login" ? "bg-[green]" : ""}
            href="/login">{t('header.nav.login')}
            </Link>}

        {loggedInUser !== 'guest' && 
          <Link 
            className={highlightedTitle === "Logout" ? "bg-[green]" : ""}
            href="#"><p onClick={logout}>{t('header.nav.logout')}</p>
          </Link>}
        {/* <p 
          className={highlightedTitle === "cart" ? "text-black" : ""}>
          test
        </p> */}

        <Language />
      </nav>

    </header>

      <p className="text-center mt-2 "><em>{quote}</em></p>
    </>
  );
};

export default Header;