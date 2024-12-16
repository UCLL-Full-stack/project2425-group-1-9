import Header from "@/components/header";
import { Customer } from "@/types";
import util from "@/util/util";

import { useEffect } from "react";

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

export default Profile;