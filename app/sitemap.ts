import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://portfolio.mohamedrashard.dev';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        // Add additional routes here if you create new pages (like /services)
        // {
        //     url: `${baseUrl}/services`,
        //     lastModified: new Date(),
        //     changeFrequency: 'monthly',
        //     priority: 0.8,
        // },
    ];
}
