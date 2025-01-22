import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Use environment variable
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, // Use environment variable
  useCdn: true,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION, // Use environment variable
});

export async function sanityFetch({
  query,
  params = {},
}: {
  query: string;
  params?: any;
}) {
  const result = await client.fetch(query, params);
  console.log("Fetched data:", result); // Debug fetched data
  return result;
}
