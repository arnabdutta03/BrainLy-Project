import config from "../config/config.js"
import mongoose from "mongoose";

await mongoose.connect(config.databaseUrl!).then(() => console.log("DB connected")).catch(err => console.error("DB Error:", err.message))

