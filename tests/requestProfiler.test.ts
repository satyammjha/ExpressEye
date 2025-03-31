import request from "supertest";
import express from "express";
import { Request, Response } from "express";
import { requestProfilerMiddleware } from "../src/index";

const app = express();

app.use(
    requestProfilerMiddleware({
        logTo: "console",
        threshold: 500,
        logLimit: 5,
        logWindowMs: 60000,
        ignoreRoutes: ["/health"],
    })
);

app.get("/", (req: Request, res: Response) => { res.status(200).json({ message: "OK" }) });
app.get("/health", (req: Request, res: Response) => { res.status(200).send("OK") });
app.get("/slow", (req, res) => {
    setTimeout(() => res.status(200).json({ message: "Slow Response" }), 600);
});

describe("ExpressEye Middleware Tests", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.useFakeTimers();
        consoleSpy = jest.spyOn(console, "log").mockImplementation(); 
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    it("✅ Should allow normal requests and log details", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("OK");
        expect(consoleSpy).toHaveBeenCalled();
    });

    it("✅ Should log slow requests exceeding the threshold", async () => {
        jest.useRealTimers();

        const warnSpy = jest.spyOn(console, "warn").mockImplementation();

        const resPromise = request(app).get("/slow");
        jest.runAllTimers();
        const res = await resPromise; 

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Slow Response");
        expect(warnSpy).toHaveBeenCalled();

        warnSpy.mockRestore();
    }, 10000);

    it("✅ Should NOT log ignored routes", async () => {
        const res = await request(app).get("/health");
        expect(res.status).toBe(200);
        expect(res.text).toBe("OK");
        expect(consoleSpy).not.toHaveBeenCalled();
    });

    it("✅ Should handle multiple requests without interfering logs", async () => {
        await request(app).get("/");
        await request(app).get("/");
        expect(consoleSpy).toHaveBeenCalledTimes(2);
    });

    it("✅ Should enforce log limits correctly", async () => {
        for (let i = 0; i < 10; i++) {
            await request(app).get("/");
        }
        expect(consoleSpy.mock.calls.length).toBeLessThanOrEqual(5);
    });

    it.skip("✅ Should log request method and URL correctly", async () => {
        const logSpy = jest.spyOn(console, "log").mockImplementation();
        
        const res = await request(app).post("/test").send({ key: "value" });
        
     
        await new Promise(resolve => setTimeout(resolve, 10));
        
        expect(res.status).toBe(404);
        expect(logSpy).toHaveBeenCalledWith(
            "[REQUEST LOG]",
            expect.objectContaining({
                method: "POST",
                url: "/test"
            })
        );
        
        logSpy.mockRestore();
    }, 40000);


    it("✅ Should NOT modify the response body", async () => {
        const res = await request(app).get("/");
        expect(res.body).toEqual({ message: "OK" });
    });
});