import { Request, Response, NextFunction } from "express";
import { promises as fs } from "fs";
import path from "path";

interface ProfilerOptions {
  logTo?: "console" | "file";
  threshold?: number;
  filePath?: string;
  fileName?: string;
  logLimit?: number; 
  logWindowMs?: number; 
  ignoreRoutes?: string[]; 
}

const requestLogs = new Map<string, number[]>(); 

export const requestProfilerMiddleware =
  (options: ProfilerOptions = { logTo: "console", threshold: 500, logLimit: 10, logWindowMs: 60000, ignoreRoutes: [] }) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

      if (options.ignoreRoutes?.includes(req.originalUrl)) {
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

      res.on("finish", async () => {
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const durationMs = seconds * 1000 + nanoseconds / 1e6;

        const logEntry = {
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          duration: `${durationMs.toFixed(2)} ms`,
          timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        };

        if (options.logTo === "console") {
          if (durationMs > (options.threshold || 500)) {
            console.warn("[SLOW REQUEST]", logEntry);
          } else {
            console.log("[REQUEST LOG]", logEntry);
          }
        }

        if (options.logTo === "file") {
          try {
            const logDir = options.filePath || path.join(__dirname, "logs");
            const logFile = options.fileName || "request.log";
            const fullPath = path.join(logDir, logFile);
            const fileLogEntry = JSON.stringify(logEntry) + "\n";

            try {
              await fs.access(logDir);
            } catch {
              await fs.mkdir(logDir, { recursive: true });
            }

            await fs.appendFile(fullPath, fileLogEntry);
          } catch (err) {
            console.error("Failed to log request:", err);
          }
        }
      });

      next();
    };