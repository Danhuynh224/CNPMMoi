import express, { Application } from "express";
import configViewEngine from "./config/viewEngine";
import bodyParser from "body-parser";
import connectDB from "./config/configdb";
import initWebRoutes from "./route/web";
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || '3000');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Config view engine
configViewEngine(app);

// Initialize web routes
initWebRoutes(app);

connectDB();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
