import { auth } from "../src/lib/auth";
import { toNodeHandler } from "better-auth/node";

export default toNodeHandler(auth);
// This is the Vercel Serverless Function handler for Better Auth.
// It will handle all auth-related requests at /api/auth/*.
