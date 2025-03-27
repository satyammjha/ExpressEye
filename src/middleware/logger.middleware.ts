import { promises as fs } from "fs";
import path from "path";

export const logToFile = async (logEntry: object, filePath?: string, fileName?: string) => {
  try {
    const logDir = filePath || path.join(__dirname, "logs");
    const logFile = fileName || "request.log";
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
};