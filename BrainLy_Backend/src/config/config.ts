import dotenv from 'dotenv'

const env = process.env.NODE_ENV || "development";


dotenv.config({ path: `.env.${env}` });



const config = {
    pepper: process.env.PEPPER,
    secret: process.env.SECRET,
    salt: Number(process.env.SALT),
    databaseUrl: process.env.DB_URI,

    cookie: {
        secure: process.env.NODE_ENV === env ? true : false,
        sameSite: process.env.NODE_ENV === env ? "none" : "lax",
        httpOnly: true
    }

};


export default config