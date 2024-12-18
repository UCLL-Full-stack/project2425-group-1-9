import Header from "@/components/Header";
import MotivationService from "@/services/MotivationService";
import util from "@/util/util";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";


const Profile: React.FC = () => {
    const setMotivation = async () => {
        const response = await MotivationService.getQuote();
        const result = await response.json()
        const quote: string = result[0].quote;
        sessionStorage.setItem('quote', quote);
    };

    return (
        <>
        <Header highlightedTitle="Profile"/>
        <main>
            <>
                <p suppressHydrationWarning>Welcome {util.getLoggedInCustomer().username}!</p>
                <button onClick={() => setMotivation()}>Set Motivation NOW!</button>
                <p>Switch pages to see the new motivation.</p>
            </>
        </main>  
    </>
    );
};

// Q& Type?
export const getServerSideProps = async (context) => {
  const { locale } = context;

  return {
      props: {
          ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
  };
};

export default Profile;