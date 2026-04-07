import { betterAuth } from "better-auth";
import { kyselyAdapter } from "better-auth/adapters/kysely";
import { db } from "./db";

export const auth = betterAuth({
    database: kyselyAdapter(db, {
        type: "sqlite", // Turso is SQLite based
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
    // Optional: add more configuration here
});
