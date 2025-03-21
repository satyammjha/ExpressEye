import express from "express";
import { rateLimiterMiddleware } from "../middleware/middleware";

const app = express();

app.use(rateLimiterMiddleware({ windowMs: 60000, maxRequests: 5 }));

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});