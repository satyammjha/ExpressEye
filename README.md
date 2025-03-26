### 📊 Express Request Profiler  
**A lightweight Express.js middleware for tracking API performance and logging request details.**  

---

## 🚀 Features  
✅ **Request Logging** – Captures method, URL, status, response time, and headers.  
✅ **Performance Metrics** – Measures execution time using `performance.now()`.  
✅ **Customizable Storage** – Supports JSON file logging and optional database storage.  
✅ **Threshold Alerts** – Warns if response time exceeds a set limit.  
✅ **Middleware Simplicity** – Plug-and-play for Express apps.  
✅ **Async/Await Support** – Fully compatible with modern async handlers.  
✅ **Exclude Routes** – Skip profiling for specific endpoints (e.g., `/health`).  
✅ **Custom Logger Integration** – Works with Winston, Logstash, and other loggers.  
✅ **Lightweight & Optimized** – Minimal performance overhead.  
✅ **TypeScript First** – Fully typed for better DX (Developer Experience).  

---

## 📦 Installation  
```sh
npm install express-request-profiler
```
or  
```sh
yarn add express-request-profiler
```

---

## 🛠 Usage  
### Basic Setup  
```ts
import express from "express";
import { requestProfiler } from "express-request-profiler";

const app = express();

app.use(requestProfiler({ threshold: 500 })); // Logs requests taking >500ms

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

---

## ⚙️ Configuration Options  
| Option         | Type      | Default | Description |
|---------------|----------|---------|-------------|
| `threshold`   | `number` | `1000`  | Log warning if response time exceeds this (in ms) |
| `excludeRoutes` | `string[]` | `[]` | Array of routes to exclude from profiling |
| `storage` | `"json" | "database"` | `"json"` | Defines where logs are stored |
| `logger` | `"console" | "winston"` | `"console"` | Custom logging method |

---

## 🔥 Upcoming Features  
🚀 **Auto Profiling with AI Suggestions** (Analyze patterns in API performance)  
🚀 **Detailed Report Generation** (Downloadable reports for API metrics)  
🚀 **Middleware Chaining Support** (Stack multiple middlewares efficiently)  
🚀 **GraphQL & WebSocket Support** (Extend support beyond REST APIs)  
🚀 **Live Dashboard Integration** (Monitor API performance in real time)  

---

## ✨ Author  
👨‍💻 **Satyam Jha**  
📧 [LinkedIn](https://www.linkedin.com/in/satyam-jha)  

---

## 📜 License  
This project is licensed under the **MIT License**.  