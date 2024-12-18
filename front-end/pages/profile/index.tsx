import Header from "@/components/Header";
import util from "@/util/util";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";


const Profile: React.FC = () => {

    return (
        <>
        <Header highlightedTitle="Profile"/>
        <main>
            <>
                {(util.getLoggedInCustomer().username === 'guest') &&                    
                    <>
                        <p>Welcome guest!</p>
                    </>
                }

                {!(util.getLoggedInCustomer().username === 'guest') &&                    
                    <>
                        <p>Welcome {util.getLoggedInCustomer().username}!</p>
                    </>
                }
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