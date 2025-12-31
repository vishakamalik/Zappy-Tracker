import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connect.js"; 
import cors from 'cors';
import eventRoutes from "./routes/event.routes.js"; 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); 

app.use('/api', eventRoutes); 

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("Database Connected");
        app.listen(3000, () => console.log(`Server running on port 3000`));
    } catch (error) {
        console.log(error);
    }
};

start();