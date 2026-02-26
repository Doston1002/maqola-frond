import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND = (process.env.NEXT_PUBLIC_API_SERVICE || 'http://localhost:8000').replace(/\/api\/?$/, '');

/**
 * PDF faylni backend dan olib, iframe da ko'rsatish uchun xavfsiz headerlar bilan qaytaradi.
 * "Bu kontent bloklangan" xatosini bartaraf etadi (X-Frame-Options).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET');
		return res.status(405).end();
	}
	const path = req.query.path as string;
	if (!path || !path.startsWith('/uploads/')) {
		return res.status(400).json({ error: 'path query kerak (masalan /uploads/articles/xxx.pdf)' });
	}
	const url = `${BACKEND}${path.startsWith('/') ? path : '/' + path}`;
	try {
		const resp = await fetch(url, { headers: { Accept: 'application/pdf' } });
		if (!resp.ok) {
			return res.status(resp.status).end();
		}
		const contentType = resp.headers.get('content-type') || 'application/pdf';
		res.setHeader('Content-Type', contentType);
		res.setHeader('Cache-Control', 'public, max-age=3600');
		// iframe da ko'rsatish uchun bloklovchi headerlarni o'rnatmaymiz
		res.removeHeader('X-Frame-Options');
		res.removeHeader('Content-Security-Policy');
		const buffer = await resp.arrayBuffer();
		res.send(Buffer.from(buffer));
	} catch (e) {
		console.error('proxy-pdf error:', e);
		return res.status(502).end();
	}
}
