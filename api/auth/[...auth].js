// Vercel deployment fix: update import path
import "dotenv/config";
import { auth } from "../_lib/auth.js";
import { toNodeHandler } from "better-auth/node";

const handler = toNodeHandler(auth);

export default async function (req, res) {
  try {
    return await handler(req, res);
  } catch (error) {
    console.error("BETTER_AUTH_INTERNAL_ERROR:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
