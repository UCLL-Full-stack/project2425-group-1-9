const getQuote = async () => {
    return await fetch(
        'https://api.api-ninjas.com/v1/quotes?category=inspirational',
        {
            method: "GET",
            headers: {
                'X-Api-Key': 'Jy24Qs/bElsml868Eac2iQ==zd6iTdoO5gOG4RCU'
            }
        }
    );
};

const MotivationService = {
    getQuote
};

export default MotivationService;