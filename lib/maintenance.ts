// Set MAINTENANCE_MODE=true (in .env.local or Vercel env vars) to swap the
// whole site for the /maintenance placeholder. On Vercel, redeploy after
// changing it — the layout reads it at build time.
export const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";
