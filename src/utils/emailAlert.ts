import { Request } from "express";
import { sendEmail } from "../service/notify.service.js";


interface ProfilerOptions {
  alertEmail?: string;
  senderEmail?: string;
  senderPassword?: string;
  latencyThreshold?: number;
  emailLimit?: number;
  emailWindowMs?: number;
}

const emailLogs = new Map<string, number[]>();


export const sendLatencyAlert = async (req: Request, durationMs: number, options: ProfilerOptions) => {
  const ip = req.ip || req.connection.remoteAddress || "global";
  const now = Date.now();

  if (!options.alertEmail) return;

  if (!emailLogs.has(ip)) {
    emailLogs.set(ip, []);
  }

  emailLogs.set(ip, emailLogs.get(ip)!.filter(timestamp => now - timestamp < (options.emailWindowMs || 600000)));

  if (emailLogs.get(ip)!.length < (options.emailLimit || 5)) {
    emailLogs.get(ip)!.push(now);

    try {
      await sendEmail(
        options.senderEmail!,
        options.senderPassword!,
        options.alertEmail!,
        "🚨 High Latency Alert - Action Required",

        `High Latency Alert
          ------------------
          Route: ${req.originalUrl}
          Latency: ${durationMs.toFixed(2)} ms
          Threshold Exceeded: ${options.latencyThreshold || 0} ms
            
          Please investigate the endpoint performance immediately.`,

        `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; padding: 25px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="border-bottom: 3px solid #ff4444; padding-bottom: 15px; margin-bottom: 25px;">
                <h1 style="color: #d32f2f; margin: 0; font-size: 24px;">
                  🚨 High Latency Alert
                </h1>
                <p style="color: #666; margin: 5px 0 0; font-size: 14px;">
                  Action Required - Performance Threshold Exceeded
                </p>
              </div>
          
              <div style="margin-bottom: 25px;">
                <div style="margin-bottom: 15px;">
                  <span style="display: block; color: #444; font-weight: 600; margin-bottom: 5px;">🔗 Route</span>
                  <code style="display: inline-block; padding: 8px 12px; background: #f8f9fa; border-radius: 4px; color: #c7254e;">
                    ${req.originalUrl}
                  </code>
                </div>
          
                <div style="margin-bottom: 15px;">
                  <span style="display: block; color: #444; font-weight: 600; margin-bottom: 5px;">⏱ Measured Latency</span>
                  <span style="font-size: 20px; color: #d32f2f; font-weight: 700;">
                    ${durationMs.toFixed(2)} ms
                  </span>
                </div>
          
                <div style="background: #fff3f3; padding: 12px; border-radius: 4px;">
                  <span style="color: #d32f2f; font-weight: 600;">📈 Threshold:</span>
                  <span style="color: #666;">${options.latencyThreshold} ms</span>
                </div>
              </div>
          
              <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #6c757d;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  ℹ️ This alert was triggered because the latency exceeds the configured threshold. 
                  Please investigate the endpoint's performance characteristics and server logs.
                </p>
              </div>
            </div>
            `
      );
      console.log(`[EMAIL ALERT] Sent high latency alert for ${req.originalUrl} (${durationMs.toFixed(2)} ms)`);
    } catch (err) {
      console.error("[EMAIL ERROR] Failed to send latency alert:", err);
    }
  }
};
