import { Request, Response, NextFunction } from "express";

interface ProfilerOptions {
    logTo?: "console" | "file"; // Logging destination
    threshold?: number; // Slow request threshold in ms
}

export const requestProfiler = (options: ProfilerOptions = { logTo: "console", threshold: 500 }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const startTime = process.hrtime();

        res.on("finish", () => {
            const [seconds, nanoseconds] = process.hrtime(startTime);
            const durationMs = seconds * 1000 + nanoseconds / 1e6;

            const logEntry = {
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                duration: `${durationMs.toFixed(2)} ms`,
                timestamp: new Date().toISOString(),
            };

            if (options.logTo === "console") {
                if (durationMs > (options.threshold || 500)) {
                    console.warn("[SLOW REQUEST]", logEntry);
                } else {
                    console.log("[REQUEST LOG]", logEntry);
                }
            }

            
        });

        next();
    };
};

export default requestProfiler;