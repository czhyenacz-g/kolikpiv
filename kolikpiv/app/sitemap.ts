import { MetadataRoute } from 'next'
import { SEO_EXAMPLES } from '../data/seo-examples'

export default function sitemap(): MetadataRoute.Sitemap {
  const seoPages: MetadataRoute.Sitemap = SEO_EXAMPLES.map((e) => ({
    url: `https://kolikpiv.cz/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: 'https://kolikpiv.cz',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://kolikpiv.cz/alkoholmetr',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://kolikpiv.cz/alkulacka',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://kolikpiv.cz/alkoholtester',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...seoPages,
  ]
}
