# Request Profiler Middleware for Express.js

## Overview

This is an Express.js middleware package that profiles incoming HTTP requests by tracking execution time, response size, and other metadata. It supports logging requests to the console or a file, setting logging limits, ignoring specific routes, and sending email alerts for slow requests.

## Features

✅ **Request Profiling** – Logs request details such as method, URL, status, duration, and timestamp.

✅ **Log to Console or File** – Choose between logging in the console or writing to a file.

✅ **Ignore Specific Routes** – Exclude certain routes (e.g., `/health`) from being logged.

✅ **Logging Limit** – Prevent excessive logging by setting a limit on stored request logs.

✅ **Email Alerts for Slow Requests** – Send email notifications when multiple requests exceed the threshold time.

✅ **Response Size Tracking** – Logs the size of responses in bytes for performance insights.

✅ **Configurable Storage Backends** – Logs can be stored in JSON, databases, or external monitoring services.

✅ **Customizable Alert System** – Set thresholds and receive alerts based on different conditions.

## Installation

```sh
npm install express-request-profiler
```

or

```sh
yarn add express-request-profiler
```

## Usage

### Basic Usage

```typescript
import express from "express";
import { requestProfilerMiddleware } from "express-request-profiler";

const app = express();

app.use(requestProfilerMiddleware({
  logTo: "file",
  threshold: 100, // Threshold in ms for slow requests
  filePath: "./logs",
  fileName: "requests.log",
  ignoreRoutes: ["/health"],
  logLimit: 1000, // Max log entries before old logs are removed
  enableResponseSizeTracking: true, // Track response sizes
  storageBackend: "json", // Options: 'json', 'database', 'monitoring-service'
  alertConfig: {
    threshold: 3, // Number of slow requests before an alert is triggered
    notifyEmail: "admin@example.com",
  }
}));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

## Configuration Options

| Option                     | Type     | Default       | Description |
|---------------------------|---------|-------------|-------------|
| `logTo`                   | string  | "console"   | Choose between `console` or `file` logging. |
| `threshold`               | number  | 500         | Requests exceeding this time (ms) are considered slow. |
| `filePath`                | string  | "./logs"    | Directory path for log files. |
| `fileName`                | string  | "request.log" | Log file name. |
| `ignoreRoutes`            | array   | `[]`        | Routes to be ignored from logging. |
| `logLimit`                | number  | 1000        | Maximum log entries before purging older ones. |
| `enableResponseSizeTracking` | boolean | false       | Enable response size tracking in logs. |
| `storageBackend`          | string  | "json"      | Storage backend for logs (`json`, `database`, `monitoring-service`). |
| `alertConfig.threshold`   | number  | 3           | Number of slow requests before triggering an alert. |
| `alertConfig.notifyEmail` | string  | ""          | Email address for receiving alerts. |

## Logging Limit Implementation

- Once the number of stored log entries exceeds `logLimit`, older logs are removed to prevent excessive log file growth.

## Author

[Satyam Jha](https://www.linkedin.com/en/satyammjha)

## License

MIT License.