
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
    alertEmail: "satyam955064@gmail.com",
    senderEmail: "satyam955064@gmail.com",
    senderPassword: "iduvhlwefsagoewz",
    latencyThreshold: 1,
    emailLimit: 3,
    emailWindowMs: 600000,
    routesToMonitor: ["/"]
}));



app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!")
});
app.listen(3000, () => console.log("Server running on port 3000"));