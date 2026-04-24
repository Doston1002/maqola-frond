import type { NextApiRequest, NextApiResponse } from 'next';
import { getBaseUrl } from 'src/config/api.config';
import { siteConfig } from 'src/config/site.config';

/**
 * Google Scholar va boshqa qidiruv tizimlari uchun sitemap.xml.
 * Barcha maqolalar sahifalarini ro'yxatlaydi.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET');
		return res.status(405).end();
	}

	const baseUrl = siteConfig.baseURL.replace(/\/$/, '');
	const apiBase = getBaseUrl();

	try {
		const response = await fetch(`${apiBase}/api/articles`);
		if (!response.ok) {
			throw new Error(`Backend ${response.status}`);
		}
		const articles: { slug?: string; isPublished?: boolean }[] = await response.json();
		const slugs = (articles || [])
			.filter((a) => a.slug && a.isPublished === true)
			.map((a) => a.slug as string);

		const collectionResponse = await fetch(`${apiBase}/api/collections`);
		if (!collectionResponse.ok) {
			throw new Error(`Backend ${collectionResponse.status}`);
		}
		const collections: { slug?: string; isPublished?: boolean }[] = await collectionResponse.json();
		const collectionSlugs = (collections || [])
			.filter((c) => c.slug && c.isPublished === true)
			.map((c) => c.slug as string);

		const urls = [
			{ loc: baseUrl, changefreq: 'daily', priority: '1.0' },
			{ loc: `${baseUrl}/articles`, changefreq: 'daily', priority: '0.9' },
			{ loc: `${baseUrl}/collections`, changefreq: 'weekly', priority: '0.8' },
			...collectionSlugs.map((slug) => ({
				loc: `${baseUrl}/collections/${slug}`,
				changefreq: 'weekly' as const,
				priority: '0.6',
			})),
			...slugs.map((slug) => ({
				loc: `${baseUrl}/articles/${slug}`,
				changefreq: 'monthly' as const,
				priority: '0.7',
			})),
		];

		const lastmod = new Date().toISOString().slice(0, 10);
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

		res.setHeader('Content-Type', 'application/xml; charset=utf-8');
		res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
		return res.status(200).send(xml);
	} catch (e) {
		console.error('Sitemap error:', e);
		res.status(500).end();
	}
}

function escapeXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
