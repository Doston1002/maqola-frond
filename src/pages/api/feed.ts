import type { NextApiRequest, NextApiResponse } from 'next';
import { getBaseUrl } from 'src/config/api.config';
import { siteConfig } from 'src/config/site.config';

/**
 * Ilmiy maqolalar uchun RSS 2.0 feed — qidiruv tizimlari va o'quvchilar uchun.
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
		if (!response.ok) throw new Error(`Backend ${response.status}`);
		const articles: {
			slug?: string;
			title?: string;
			authors?: string;
			abstract?: string;
			createdAt?: string;
			isPublished?: boolean;
		}[] = await response.json();

		const items = (articles || [])
			.filter((a) => a.slug && a.isPublished === true)
			.slice(0, 50)
			.map((a) => {
				const title = a.title || 'Maqola';
				const link = `${baseUrl}/articles/${a.slug}`;
				const desc = (a.abstract || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 300);
				const pubDate = a.createdAt ? new Date(a.createdAt).toUTCString() : new Date().toUTCString();
				return { title, link, description: desc, pubDate, author: a.authors };
			});

		const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.siteName)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Ilmiy maqolalar — ${escapeXml(siteConfig.siteName)}</description>
    <language>uz</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(baseUrl)}/feed.xml" rel="self" type="application/rss+xml" />
${items.map((i) => `    <item>
      <title>${escapeXml(i.title)}</title>
      <link>${escapeXml(i.link)}</link>
      <description>${escapeXml(i.description)}</description>
      <pubDate>${i.pubDate}</pubDate>
      ${i.author ? `<author>${escapeXml(i.author)}</author>` : ''}
    </item>`).join('\n')}
  </channel>
</rss>`;

		res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
		res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
		return res.status(200).send(rss);
	} catch (e) {
		console.error('RSS feed error:', e);
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
