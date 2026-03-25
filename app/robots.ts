import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Add any routes you want to hide from Google here
            // disallow: '/private/',
        },
        sitemap: 'https://portfolio.mohamedrashard.dev/sitemap.xml',
    };
}
