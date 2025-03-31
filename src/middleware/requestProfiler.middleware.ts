import { Request, Response, NextFunction } from "express";
import { logRequest } from "../middleware/logger.middleware";
import { sendLatencyAlert } from "../utils/emailAlert";

interface ProfilerOptions {
  logTo?: "console" | "file";
  threshold?: number;
  filePath?: string;
  fileName?: string;
  logLimit?: number;
  logWindowMs?: number;
  ignoreRoutes?: string[];
  sendEmailAlert?: boolean;
  alertEmail?: string;
  senderEmail?: string;
  senderPassword?: string;
  latencyThreshold?: number;
  emailLimit?: number;
  emailWindowMs?: number;
  routesToMonitor?: string[];
}

const requestLogs = new Map<string, number[]>();

export const requestProfilerMiddleware =
  (options: ProfilerOptions = {
    logTo: "console",
    threshold: 500,
    logLimit: 10,
    logWindowMs: 60000,
    ignoreRoutes: [],
    latencyThreshold: 1000,
    emailLimit: 5,
    emailWindowMs: 600000,
    routesToMonitor: []
  }) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

      if (options.ignoreRoutes?.some(route => route === req.originalUrl)) {
        return next();
    }

      const ip = req.ip || req.connection.remoteAddress || "global";
      const now = Date.now();

      if (requestLogs.has(ip)) {
        requestLogs.set(ip, requestLogs.get(ip)!.filter(timestamp => now - timestamp < (options.logWindowMs || 60000)));
      } else {
        requestLogs.set(ip, []);
      }

      if (requestLogs.get(ip)!.length >= (options.logLimit || 10)) {
        return next();
      }

      requestLogs.get(ip)!.push(now);
      const startTime = process.hrtime();

      let responseSize = 0;
      const originalWrite = res.write;
      const originalEnd = res.end;
      res.write = function (chunk: any, ...args: any[]) {
        responseSize += Buffer.byteLength(chunk);
        return originalWrite.apply(res, [chunk, args[0] || "utf8", args[1]]);
      };

      res.end = function (chunk: any, ...args: any[]) {
        if (chunk) responseSize += Buffer.byteLength(chunk);
        return originalEnd.apply(res, [chunk, args[0] || "utf8", args[1]]);
      };

      res.on("finish", async () => {

        const [seconds, nanoseconds] = process.hrtime(startTime);
        const durationMs = seconds * 1000 + nanoseconds / 1e6;

        const logEntry = {
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          durationMs,
          responseSize,
          timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        };

        await logRequest(logEntry, options);

        if (
          durationMs > (options.latencyThreshold || 1000) &&
          (options.routesToMonitor?.includes(req.originalUrl) || options.routesToMonitor?.length === 0)
        ) {
          if (
            options.sendEmailAlert &&
            durationMs > (options.latencyThreshold || 1000) &&
            (options.routesToMonitor?.includes(req.originalUrl) || options.routesToMonitor?.length === 0)
          ) {
            await sendLatencyAlert(req, durationMs, options);
          }
        }
      });

      next();
    };