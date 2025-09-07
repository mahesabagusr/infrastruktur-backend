import { PrismaClient } from "generated/prisma/index.js";

const isProd = process.env.NODE_ENV === "production";

const log = isProd
  ? [
    { emit: "stdout", level: "error" },
    { emit: "stdout", level: "warn" },
  ]
  : [
    { emit: "event", level: "query" },
    { emit: "stdout", level: "info" },
    { emit: "stdout", level: "warn" },
    { emit: "stdout", level: "error" },
  ];

const prismaClient =
  globalThis.prisma ??
  new PrismaClient({
    log,
    errorFormat: isProd ? "minimal" : "pretty",
  });


function attachQueryLogger(prisma) {
  if (isProd) return;
  const MAX = 500;
  prisma.$on("query", (e) => {
    const params =
      e.params && e.params.length > MAX ? e.params.slice(0, MAX) + "…" : e.params;
    console.log(`[Prisma] ${e.duration}ms`);
    console.log(`[Prisma] Query: ${e.query}`);
    if (params) console.log(`[Prisma] Params: ${params}`);
  });
}
attachQueryLogger(prismaClient);

if (!globalThis.prisma) globalThis.prisma = prismaClient;

export const prisma = prismaClient;

const shutdown = async () => {
  try {
    await prisma.$disconnect();
  } catch {
    // ignore
  }
};
process.on("beforeExit", shutdown);
process.on("SIGINT", async () => {
  await shutdown();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await shutdown();
  process.exit(0);
});