import { createClient } from 'next-sanity';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,  // Use environment variable for project ID
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,      // Use environment variable for dataset
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,  // Use environment variable for API version
  useCdn: false,  // Set to false if statically generating pages
  token: process.env.SANITY_API_TOKEN,  // Use environment variable for API token
});
