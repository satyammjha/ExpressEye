import { promises as fs } from "fs";
import path from "path";

interface ProfilerOptions {
  logTo?: "console" | "file";
  filePath?: string;
  fileName?: string;
  threshold?: number;
}

interface LogEntry {
  durationMs: number;
  [key: string]: any; 
}

export const logRequest = async (logEntry: LogEntry, options: ProfilerOptions) => {
  try {
    if (options.logTo === "console") {
      if (logEntry["durationMs"] > (options.threshold || 500)) {
        console.warn("[SLOW REQUEST]", logEntry);
      } else {
        console.log("[REQUEST LOG]", logEntry);
      }
    }

    if (options.logTo === "file") {
      const logDir = options.filePath || path.join(__dirname, "../logs");
      const logFile = options.fileName || "request.log";
      const fullPath = path.join(logDir, logFile);
      const fileLogEntry = JSON.stringify(logEntry) + "\n";

      try {
        await fs.access(logDir);

      } catch {
        await fs.mkdir(logDir, { recursive: true });
      }

      await fs.appendFile(fullPath, fileLogEntry);
      console.log("[LOGGING] Request logged successfully.");
    }
  } catch (err) {
    console.error("[LOGGING ERROR] Failed to log request:", err);
  }
};