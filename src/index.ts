import { Request, Response, NextFunction } from 'express';
interface RateLimiterOptions {
    windowMs: number,
    maxRequests: number
}

const rateLimitMap = new Map<string, { count: number, lastReset: number }>();


export const rateLimiter = (options: RateLimiterOptions) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip || "unknown";
        const currentTime = Date.now();

        if (!rateLimitMap.has(ip)) {
            rateLimitMap.set(ip, { count: 1, lastReset: currentTime });
            return next();
        }

        const userData = rateLimitMap.get(ip)!;
        if (currentTime - userData.lastReset > options.windowMs) {
            userData.count = 1;
            userData.lastReset = currentTime;
            return next();
        }

        if (userData.count >= options.maxRequests) {
            return res.status(429).json({ error: "Too many requests. Try again later." });
        }

        userData.count++;
        return next();
    };
};

export default rateLimiter;