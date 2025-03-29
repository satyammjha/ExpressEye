import request from "supertest";
import express from "express";
import { requestProfilerMiddleware } from "../src/index";

const app = express();
app.use(requestProfilerMiddleware({ logTo: "console", threshold: 500 }));

app.get("/", (req: express.Request, res: express.Response) => {
    res.json({ message: "OK" });
});

describe("Request Profiler Middleware", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should allow normal requests and log profiling data", async () => {
        const consoleSpy = jest.spyOn(console, "log").mockImplementation();
        const res = await request(app).get("/");
        
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("OK");
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it("should log slow requests exceeding the threshold", async () => {
        const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

        app.use((req, res, next) => {
            setTimeout(() => next(), 600);
        });

        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it("should not log fast requests below threshold", async () => {
        const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

        app.use((req, res, next) => {
            setTimeout(() => next(), 200);
        });

        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(consoleSpy).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it("should log request details including method and URL", async () => {
        const consoleSpy = jest.spyOn(console, "log").mockImplementation();

        const res = await request(app).post("/test").send({ key: "value" });

        expect(res.status).toBe(404);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("POST /test"));

        consoleSpy.mockRestore();
    });

    it("should not break response body", async () => {
        const res = await request(app).get("/");
        expect(res.body).toEqual({ message: "OK" });
    });

    it("should handle cases where threshold is undefined", async () => {
        const testApp = express();
        testApp.use(requestProfilerMiddleware({ logTo: "console" }));

        const consoleSpy = jest.spyOn(console, "log").mockImplementation();
        const res = await request(testApp).get("/");

        expect(res.status).toBe(404);
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it("should handle multiple requests without interfering logs", async () => {
        const consoleSpy = jest.spyOn(console, "log").mockImplementation();

        await request(app).get("/");
        await request(app).get("/");

        expect(consoleSpy).toHaveBeenCalledTimes(2);

        consoleSpy.mockRestore();
    });
});