import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fact-machine.vercel.app'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // 다른 페이지가 있다면 여기에 추가하세요. 예:
    // { url: `${baseUrl}/about`, lastModified: new Date() },
    // { url: `${baseUrl}/contact`, lastModified: new Date() },
  ]
}