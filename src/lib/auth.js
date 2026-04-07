import { betterAuth } from "better-auth";
import { kyselyAdapter } from "better-auth/adapters/kysely";
import { db } from "./db";

export const auth = betterAuth({
    database: kyselyAdapter(db, {
        type: "sqlite", // Turso is SQLite based
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
    advanced: {
        crossAndOriginChecks: {
            allowOrigins: [process.env.BETTER_AUTH_URL || ""]
        }
    }
});
