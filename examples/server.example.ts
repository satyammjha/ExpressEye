import dotenv from "dotenv";
import path from "path";
import express, { Request, Response } from "express";
import { requestProfilerMiddleware } from "../src/middleware/requestProfiler.middleware";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const email=process.env.EMAIL_ADDRESS;
const password=process.env.EMAIL_APP_PASSWORD;


app.use(requestProfilerMiddleware({
    logTo: "console",
    filePath: "../logs",
    fileName: "requests.log",
    threshold: 300,
    logLimit: 20,
    logWindowMs: 60000,
    sendEmailAlert: false,
    alertEmail: email,
    senderEmail: email,
    senderPassword: password,
    latencyThreshold: 1,
    emailLimit: 3,
    emailWindowMs: 600000,
    routesToMonitor: ["/"]
}));



app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hello World!")
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).send("OK");
});

app.listen(3000, () => console.log("Server running on port 3000"));