import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

// Fetch all projects of a given mode ('ui' or 'ux')
export async function getProjects(mode) {
  return client.fetch(`
    *[_type == "project" && mode == $mode] | order(order asc, year desc) {
      _id,
      title,
      type,
      year,
      description,
      mode,
      "thumbnailUrl": thumbnail.asset->url,
      slides[] {
        label,
        caption,
        "imageUrl": image.asset->url
      }
    }
  `, { mode })
}

// Fetch about/bio content
export async function getAbout() {
  return client.fetch(`*[_type == "about"][0]`)
}
