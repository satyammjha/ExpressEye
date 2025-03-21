import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.lastReset > 60000) {
      rateLimitMap.delete(key);
    }
  }
}, 30000); // Cleanup every 30 sec

export const rateLimiterMiddleware =
  (options: RateLimitOptions) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";
    const currentTime = Date.now();

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, lastReset: currentTime });
      next();
      return;
    }

    const userData = rateLimitMap.get(ip)!;

    if (currentTime - userData.lastReset > options.windowMs) {
      userData.count = 1;
      userData.lastReset = currentTime;
      next();
      return;
    }

    if (userData.count >= options.maxRequests) {
      res.status(429).json({ error: "Too many requests. Try again later." });
      return;
    }

    userData.count++;
    next();
  };
