import request from "supertest";
import express from "express";
import { requestProfilerMiddleware } from "../middleware/requestProfiler.middleware";

const app = express();
app.use(requestProfilerMiddleware({ logTo: "console", threshold: 500 }));

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("OK");
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
});
