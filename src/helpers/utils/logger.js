import winston from "winston";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "cookie",
  "cookies",
  "set-cookie",
  "secret",
  "apiKey",
]);

function redactDeep(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(redactDeep);
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? "***" : redactDeep(v);
  }
  return out;
}


const normalizeFormat = winston.format((info) => {
  if (info && typeof info.message === "object" && info.message !== null) {
    const payload = info.message;
    const message = payload.message || payload.msg || "LOG";
    const { message: _m, msg: _mm, ...rest } = payload;
    info.message = message;
    Object.assign(info, rest);
  }
  if ((!info.message || typeof info.message !== "string") && typeof info.msg === "string") {
    info.message = info.msg;
    delete info.msg;
  }

  if (info instanceof Error) {
    return { ...info, message: info.message, stack: info.stack };
  }
  return info;
});

const redactFormat = winston.format((info) => {
  const keep = ["level", "message", "timestamp", "stack"];
  const meta = {};
  for (const [k, v] of Object.entries(info)) {
    if (keep.includes(k)) continue;
    meta[k] = v;
    delete info[k];
  }
  const redacted = redactDeep(meta);
  return { ...info, ...redacted };
});

const consolePrintf = winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
  const base = `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return base + extra;
});

const isProd = process.env.NODE_ENV === "production";
const level = (process.env.LOG_LEVEL || (isProd ? "info" : "debug")).toLowerCase();

const logger = winston.createLogger({
  level,
  format: winston.format.combine(
    normalizeFormat(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        consolePrintf
      ),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "app.log"),
      format: winston.format.combine(
        redactFormat(),
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
      tailable: true,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      format: winston.format.combine(
        redactFormat(),
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
      tailable: true,
      handleExceptions: true,
    }),
  ],
});

// Helper compatible with current usage
logger.request = (req, message = "HTTP") => {
  const requestId = req.id || crypto.randomUUID();
  logger.info({
    msg: message,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get?.("User-Agent"),
    userId: req.user?.user_id || "anonymous",
    requestId,
  });
};

export default logger;