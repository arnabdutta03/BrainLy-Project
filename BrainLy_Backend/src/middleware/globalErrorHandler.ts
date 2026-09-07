import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ZodError } from "zod";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof ZodError) {
        return res.status(400).json({ success: false, message: err.issues[0]?.message , type: err.issues[0]?.path[0]});
    }

    if (err instanceof jwt.TokenExpiredError || err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ success: false, message: "GlobalError: Unauthorized user" });
    }

    if (err.code === 11000)
        return res.status(409).json({ success: false, message: `${Object.keys(err.keyPattern)[0]} already exist!`, type: 'email' });

    res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
};

export default globalErrorHandler;