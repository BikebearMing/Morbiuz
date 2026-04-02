import { GraphQLClient } from "graphql-request";

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

  return new GraphQLClient(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
}
