import request from "supertest";
import express from "express";
import { rateLimiterMiddleware } from "../middleware/middleware";

const app = express();
app.use(rateLimiterMiddleware({ windowMs: 60000, maxRequests: 2 }));
app.get("/", (req: express.Request, res: express.Response) => {
    res.send("OK")
}
);

describe("Rate Limiter", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should allow requests within the limit", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
    });

    it("should block requests exceeding the limit", async () => {
        await request(app).get("/");
        await request(app).get("/");
        const res = await request(app).get("/");
        expect(res.status).toBe(429);
    });

    it("should reset the limit after window expires", async () => {
        await request(app).get("/");
        await request(app).get("/");

        jest.advanceTimersByTime(60001);
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
    });
});
