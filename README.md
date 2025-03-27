# Request Profiler Middleware for Express.js

## Overview

This is an Express.js middleware package that profiles incoming HTTP requests by tracking execution time, response size, and other metadata. It supports logging requests to the console or a file, setting logging limits, ignoring specific routes, and sending email alerts for slow requests.

## Features

✅ **Request Profiling** – Logs request details such as method, URL, status, duration, and timestamp.

✅ **Log to Console or File** – Choose between logging in the console or writing to a file.

✅ **Ignore Specific Routes** – Exclude certain routes (e.g., `/health`) from being logged.

✅ **Logging Limit** – Prevent excessive logging by setting a limit on stored request logs.

✅ **Email Alerts for Slow Requests** – Send email notifications when multiple requests exceed the threshold time.

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
}));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

## Configuration Options

| Option            | Type     | Default       | Description |
|------------------|---------|-------------|-------------|
| `logTo`          | string  | "console"   | Choose between `console` or `file` logging. |
| `threshold`      | number  | 500         | Requests exceeding this time (ms) are considered slow. |
| `filePath`       | string  | "./logs"    | Directory path for log files. |
| `fileName`       | string  | "request.log" | Log file name. |
| `ignoreRoutes`   | array   | `[]`        | Routes to be ignored from logging. |
| `logLimit`       | number  | 1000        | Maximum log entries before purging older ones. |

## Logging Limit Implementation

- Once the number of stored log entries exceeds `logLimit`, older logs are removed to prevent excessive log file growth.
## Author

[Satyam Jha](https://www.linkedin.com/en/satyammjha)

## License

MIT License.