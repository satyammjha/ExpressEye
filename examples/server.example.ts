import express from "express";
import { requestProfilerMiddleware } from "../src/index";

const app = express();

app.use(requestProfilerMiddleware({
  logTo: "file",
  threshold: 100,
  filePath: "../logs",
  fileName: "requests.log",
  logLimit: 5, 
  logWindowMs: 60000,
  ignoreRoutes: ["/health", "/status"],
}));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});