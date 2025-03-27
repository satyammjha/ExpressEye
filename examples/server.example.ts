
import express, { Request, Response } from "express";
import { requestProfilerMiddleware } from "../src/middleware/requestProfiler.middleware";

const app = express();

app.use(requestProfilerMiddleware({
    logTo: "file",
    filePath: "../logs",
    fileName: "requests.log",
    threshold: 300,
    logLimit: 20,
    logWindowMs: 60000,
    ignoreRoutes: ["/health"],
    alertEmail: "example@gmail.com",
    senderEmail: "example@gmail.com",
    senderPassword: "gmail_app_password",
    latencyThreshold: 1,
    emailLimit: 3,
    emailWindowMs: 600000,
    routesToMonitor: ["/"]
}));



app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!")
});
app.listen(3000, () => console.log("Server running on port 3000"));