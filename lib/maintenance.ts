// Maintenance mode is toggled in WordPress (ACF → Site Settings → Maintenance
// Mode). MAINTENANCE_MODE=true in the env forces it on regardless — use that
// if the CMS itself is down.
const FORCE_ON = process.env.MAINTENANCE_MODE === "true";

const QUERY = "{ siteSettings { maintenance { maintenanceMode } } }";
const TTL_MS = 30_000;

// Per-instance cache so the proxy only asks WordPress every TTL_MS, not on
// every request. On a failed check the last known value is kept.
let cached = { value: false, expires: 0 };

export async function isMaintenanceMode(): Promise<boolean> {
  if (FORCE_ON) return true;
  if (Date.now() < cached.expires) return cached.value;

  const url = process.env.WORDPRESS_API_URL;
  const username = process.env.WP_APPLICATION_USERNAME;
  const password = process.env.WP_APPLICATION_PASSWORD;
  if (!url || !username || !password) return false;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
      body: JSON.stringify({ query: QUERY }),
      signal: AbortSignal.timeout(3000),
    });
    const json = await res.json();
    cached.value = json?.data?.siteSettings?.maintenance?.maintenanceMode === true;
  } catch (error) {
    console.error("Maintenance mode check failed:", error);
  }

  cached = { value: cached.value, expires: Date.now() + TTL_MS };
  return cached.value;
}
