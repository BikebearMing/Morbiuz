import { GraphQLClient } from "graphql-request";

// CMS media is proxied through our own domain via the `/media/*` rewrite in
// next.config.ts. WordPress returns absolute upload URLs in GraphQL responses
// (e.g. `sourceUrl`), so rewrite just those to the proxied path. Scoped to
// `/wp-content/uploads/` so post permalinks / page `uri`s are left untouched.
const WP_MEDIA_ORIGIN = "https://morbiuz.mydemobb.com/wp-content/uploads/";
const PROXY_MEDIA_PATH = "/media/wp-content/uploads/";

function proxyMediaUrls<T>(data: T): T {
  if (data == null) return data;
  const json = JSON.stringify(data);
  if (!json.includes(WP_MEDIA_ORIGIN)) return data;
  return JSON.parse(json.split(WP_MEDIA_ORIGIN).join(PROXY_MEDIA_PATH));
}

export function getClient() {
  const url = process.env.WORDPRESS_API_URL;

  if (!url) {
    throw new Error("WORDPRESS_API_URL is not defined");
  }

  const username = process.env.WP_APPLICATION_USERNAME;
  const password = process.env.WP_APPLICATION_PASSWORD;

  if (!username || !password) {
    throw new Error("WordPress credentials are not defined");
  }

  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  const client = new GraphQLClient(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  // Rewrite CMS media URLs in every response to flow through our proxy.
  const request = client.request.bind(client);
  client.request = (async (...args: Parameters<typeof request>) =>
    proxyMediaUrls(await request(...args))) as typeof client.request;

  return client;
}
