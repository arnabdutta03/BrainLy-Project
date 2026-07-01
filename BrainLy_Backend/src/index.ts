import express from "express"
import "./database/db.js";
import userRoutes from './routes/userRoutes.js';
import contentRoute from './routes/contentRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import globalErrorHandler from './middleware/globalErrorHandler.js'

const app = express()
app.use(express.json());

app.use(cookieParser());
app.use(cors())
app.use(cors({
    origin: "http://localhost:3000",
    // credentials: true,
}));



// All the routers
app.use('/', userRoutes);
app.use('/', contentRoute);


// MUST be last
app.use(globalErrorHandler);


app.listen(3000, '0.0.0.0', () => console.log('Server is Up and Running!!!'))
