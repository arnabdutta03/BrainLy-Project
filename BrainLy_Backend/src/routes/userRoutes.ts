import express from 'express'
import { UserSignUpSchema, UserSignInSchema } from '../config/zod.js'
import User from '../database/user.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const userRouter = express.Router();




// SignUp Endpoint

userRouter.post('/api/v1/signup', async (req, res, next) => {

    try {
        let { username, email, password }: { username: string; email: string; password: string; } = req.body

        const userInput = {
            username,
            email,
            password
        }

        const result = UserSignUpSchema.parse(userInput)

        const hashedPassword = await argon2.hash(result.password + config.pepper, {
            type: argon2.argon2id,
            memoryCost: 65536, // 64 MB
            timeCost: 3,
            parallelism: 1,
        });

        const DBresult = await User.create({
            username: result.username,
            email: result.email,
            password: hashedPassword,
        });

        if (!DBresult)
            return res.status(400).json({ success: false, message: "Data is not inserted into database" })


        return res.status(201).json({ success: true, message: "User created successfully" })

    } catch (error) {
        console.log('SignUp Error: ' + error);
        next(error)
    }
});


userRouter.post('/api/v1/signin', async (req, res, next) => {
    try {
        let { email, password }: { email: string; password: string; } = req.body

        const userInput = {
            email,
            password
        }

        const result = UserSignInSchema.parse(userInput)

        const existingUser = await User.findOne({ email: result.email })

        if (!existingUser)
            return res.status(401).json({ success: false, message: 'Incorrect Email or Password' })

        const isCorrect = await argon2.verify(existingUser.password, password + config.pepper)

        if (!isCorrect)
            return res.status(401).json({ success: false, message: 'Incorrect password' })


        const token = jwt.sign({
            id: existingUser._id.toString(),
            username: existingUser.username,
        }, config.secret, {
            algorithm: "HS256",
            expiresIn: "1h",
        });


        req.headers.token = token

        res.cookie('token', token, {
            secure: config.cookie.secure,
            httpOnly: config.cookie.httpOnly,
            sameSite: config.cookie.sameSite === 'none' ? 'none' : 'lax',
            maxAge: 1000 * 60 * 60 * 1,
        })

        res.status(200).json({ success: true, message: 'Logged in successfull' })

    } catch (error) {
        console.log('SignIn Error: ' + error);
        next(error)
    }
});

export default userRouter;