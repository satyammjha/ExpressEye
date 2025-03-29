# Request Profiler Middleware for Express.js

## Overview

`express-request-profiler` is a lightweight middleware for Express.js that tracks and logs HTTP requests in real time. It provides insights into request execution time, response size, and other metadata. With configurable logging, alert mechanisms, and support for multiple storage backends, this middleware helps optimize performance monitoring.

## Features

- ✅ **Detailed Request Profiling** – Logs HTTP method, URL, status, execution time, and timestamp.
- ✅ **Flexible Logging Options** – Output logs to the console or store them in a file.
- ✅ **Ignore Specific Routes** – Exclude endpoints (e.g., `/health`) from logging.
- ✅ **Logging Limit Control** – Prevent excessive log growth with configurable log storage limits.
- ✅ **Email Alerts for Slow Requests** – Receive notifications when multiple requests exceed a specified response time.
- ✅ **Response Size Tracking** – Logs response sizes for better performance insights.
- ✅ **Configurable Storage Backends** – Store logs in JSON, databases, or external monitoring services.
- ✅ **Customizable Alert System** – Define alert thresholds and notification settings based on request performance.

## Installation

Install the package via npm or yarn:

```sh
npm install express-request-profiler
```

or

```sh
yarn add express-request-profiler
```

## Usage

### Basic Setup

```typescript
import express from "express";
import { requestProfilerMiddleware } from "express-request-profiler";

const app = express();

app.use(
  requestProfilerMiddleware({
    logTo: "file",
    threshold: 100, // Requests exceeding 100ms are flagged as slow
    filePath: "./logs",
    fileName: "requests.log",
    ignoreRoutes: ["/health"],
    logLimit: 1000, // Max log entries before purging old logs
    enableResponseSizeTracking: true,
    storageBackend: "json", // Options: 'json', 'database', 'monitoring-service'
    alertConfig: {
      threshold: 3, // Alert triggered after 3 slow requests
      notifyEmail: "admin@example.com",
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

## Configuration Options

| Option                       | Type    | Default        | Description                                                          |
| ---------------------------- | ------- | -------------- | -------------------------------------------------------------------- |
| `logTo`                      | string  | "console"      | Determines the logging output (`console` or `file`).                 |
| `threshold`                  | number  | 500            | Requests exceeding this time (ms) are considered slow.               |
| `filePath`                   | string  | "./logs"       | Directory path for storing log files.                                |
| `fileName`                   | string  | "requests.log" | Name of the log file.                                                |
| `ignoreRoutes`               | array   | `[]`           | List of routes to be excluded from logging.                          |
| `logLimit`                   | number  | 1000           | Maximum number of stored log entries before purging old logs.        |
| `enableResponseSizeTracking` | boolean | false          | Enables logging of response sizes.                                   |
| `storageBackend`             | string  | "json"         | Storage backend for logs (`json`, `database`, `monitoring-service`). |
| `alertConfig.threshold`      | number  | 3              | Number of slow requests before triggering an alert.                  |
| `alertConfig.notifyEmail`    | string  | ""             | Email address for alert notifications.                               |

## Logging Limit Implementation

- When the number of stored log entries exceeds `logLimit`, older logs are automatically removed to prevent excessive file growth.

## Author

[Satyam Jha](https://www.linkedin.com/en/satyammjha)

## License

This project is licensed under the **MIT License**.
