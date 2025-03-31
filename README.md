# expresseye - Express Request Profiler Middleware

## 🚀 Overview
expresseye is a lightweight Express middleware designed to monitor API request performance, log request details, and send email alerts for slow requests. This helps developers optimize their APIs by identifying slow endpoints and analyzing traffic patterns.

## 📌 Features
- ✅ **Request Logging** - Logs API request details (method, response time, response size, etc.).
- ✅ **Custom Log Storage** - Log to console or files with configurable paths.
- ✅ **Rate-Limited Logging** - Avoids excessive logging for spammy requests.
- ✅ **Latency Alerts via Email** - Sends an email when a request takes too long.
- ✅ **Selective Monitoring** - Choose which routes to monitor/ignore.
- ✅ **Performance Optimization** - Identify slow endpoints and optimize them.

## 📚 Why Use `expresseye`?
- 🔹 **Monitor API Performance** - Track slow endpoints & optimize request handling.
- 🔹 **Automated Latency Alerts** - Get notified when API response time crosses a set threshold.
- 🔹 **Efficient Logging** - Rate-limited logging prevents overwhelming the logs.
- 🔹 **Plug & Play** - Simple integration into any Express project.

## 📝 Installation
```bash
npm install expresseye
```
or  
```bash
yarn add expresseye
```

## 🛠️ Usage (Basic Example)
### Import & Use in Express
```typescript
import dotenv from "dotenv";
import path from "path";
import express, { Request, Response } from "express";
import { requestProfilerMiddleware } from "expresseye";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const email = process.env.EMAIL_ADDRESS;
const password = process.env.EMAIL_APP_PASSWORD;

app.use(requestProfilerMiddleware({
    logTo: "file",
    filePath: "../logs",
    fileName: "requests.log",
    threshold: 300,
    logLimit: 20,
    logWindowMs: 60000,
    ignoreRoutes: ["/health"],
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
    res.status(200).send("Hello World!");
});

app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("OK");
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

## ⚙️ Configuration Options
Below are the configurable arguments with their default values and descriptions:

| Option              | Type     | Default Value  | Description |
|--------------------|---------|---------------|-------------|
| `logTo`           | string  | `"console"`   | `"console"` or `"file"` (where to log requests). |
| `filePath`        | string  | `""`          | Path for log files if `logTo` is `"file"`. |
| `fileName`        | string  | `""`          | File name for log storage. |
| `threshold`       | number  | `500`         | Minimum response time (ms) to log a request. |
| `logLimit`        | number  | `10`          | Max logs per IP within `logWindowMs`. |
| `logWindowMs`     | number  | `60000`       | Time window for log limit in ms. |
| `ignoreRoutes`    | string[]| `[]`          | Routes to exclude from logging. |
| `sendEmailAlert`  | boolean | `false`       | If `true`, sends email alerts for slow requests. |
| `alertEmail`      | string  | `""`          | Email address to receive alerts. |
| `senderEmail`     | string  | `""`          | Email address used to send alerts. |
| `senderPassword`  | string  | `""`          | App password for sender email. |
| `latencyThreshold`| number  | `1000`        | If request takes more than this (ms), an alert is triggered. |
| `emailLimit`      | number  | `5`           | Max emails sent within `emailWindowMs`. |
| `emailWindowMs`   | number  | `600000`      | Time window for email alerts in ms. |
| `routesToMonitor` | string[]| `[]`          | Specific routes to monitor for slow responses. |

## 📩 Email Alerts Configuration
- You can send **latency alerts** to:  
  ✅ **Your own email** *(by setting `alertEmail` to your email).*  
  ✅ **Another user’s email** *(by setting `alertEmail` to a different email).*  

### 🔑 How to Get an Email App Password?
- You **need an app password** of your gmail account instead of your normal gmail password.  
- **Follow this [video guide](https://youtu.be/_2TLKA4sPbk?si=gWBcqc_suHq5M3ho) to generate an app password.**  

### 👨‍💻 Environment Variables Setup
Add the following to your `.env` file:
```env
EMAIL_ADDRESS=your.email@provider.com
EMAIL_APP_PASSWORD=your-generated-app-password
```

## 📊 Example Scenarios
| Scenario | Config | Expected Behavior |
|----------|--------|------------------|
| **Log all requests to a file** | `logTo: "file", filePath: "../logs"` | Requests get logged in `../logs/requests.log`. |
| **Send email alerts when response time > 1s** | `latencyThreshold: 1000, sendEmailAlert: true` | If a request takes >1s, an email alert is sent. |
| **Ignore `/health` route** | `ignoreRoutes: ["/health"]` | `/health` requests won't be logged. |
| **Limit logging to 20 requests per IP in 1 min** | `logLimit: 20, logWindowMs: 60000` | Prevents spam logging from a single user. |

## 🛠️ Common Issues & Debugging Tips
- **Not receiving email alerts?**
  - Check if `sendEmailAlert` is set to `true`.
  - Make sure `alertEmail` and `senderEmail` are correctly configured.
  - Ensure you’ve set up an **email app password** correctly.
- **Logs are not being saved in a file?**
  - Check if `logTo` is set to `"file"`.
  - Ensure `filePath` and `fileName` are correctly set.

## 👨‍💻 Author
This project is developed and maintained by **[Satyam Jha](https://www.linkedin.com/en/satyammjha)**.

## 🐟 License
This project is licensed under the **MIT License** and open for contributions!