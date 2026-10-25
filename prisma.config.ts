import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // `prisma generate` no necesita la base de datos; el respaldo evita que falle el build sin DATABASE_URL
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
});
