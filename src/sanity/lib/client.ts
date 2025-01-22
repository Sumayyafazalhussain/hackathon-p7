import { createClient } from 'next-sanity';

export const sanityClient = createClient({
  projectId: "nyw8htzm",
  dataset: "production",
  apiVersion: "2021-08-31",
  useCdn: false, // Set to false if statically generating pages
  token: "skvwseKmAEfxtQs3wyYlB7lGHDYAuMvoSN1HS6VeIYWQYpsXtvqNgKKrCFCLACrfxbxM1WX0dRsuuOdW6EsNp9GXHB9LOagI3OJvD2lMJIyU8eWJV3v8fH2twGZfkNxUTh2EGazCGkm2T4u4S9IfCKYM8WeVArFN6lv4oLFmAanTtiOlJ3YC",
});
