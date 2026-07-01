import { type Request, type Response, type NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import config from '../config/config.js';


interface CustomRequest extends Request {
    UserObj?: any
}

const authCheck = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {

        const token = req.cookies.token;

        if (!token)
            return res.status(401).json({ success: false, message: 'Unauthorized user' })

        const decoded = jwt.verify(token, config.secret, { algorithms: ["HS256"] });


        if (!decoded)
            return res.status(401).json({ success: false, message: 'Unauthorized user' })

        req.UserObj = decoded

        next()
    } catch (error) {
        console.log('AuthCheck: ' + error);
        next(error);
    }
}

export default authCheck;
