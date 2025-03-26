import express from "express";
import { requestProfilerMiddleware } from "../middleware/requestProfiler.middleware";

const app = express();

app.use(requestProfilerMiddleware({ logTo: "console", threshold: 500 }));

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
