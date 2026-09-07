import dotenv from 'dotenv'


const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });


const SECRET = process.env.SECRET;
const PEPPER = process.env.PEPPER;
const SALT = Number(process.env.SALT);
const DB_URI = process.env.DB_URI;

if (!SECRET) {
    throw new Error("SECRET environment variable is missing.");
}

if (!PEPPER) {
    throw new Error("PEPPER environment variable is missing.");
}

if (!SALT) {
    throw new Error("SALT environment variable is missing.");
}

if (!DB_URI) {
    throw new Error("DB URI environment variable is missing.");
}


const config = {
    pepper: PEPPER,
    secret: SECRET,
    salt: SALT,
    databaseUrl: DB_URI,

    cookie: {
        secure: process.env.NODE_ENV === env ? true : false,
        sameSite: process.env.NODE_ENV === env ? "none" : "lax",
        httpOnly: true
    }

};


export default config