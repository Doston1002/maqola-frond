import type { NextApiRequest, NextApiResponse } from 'next';

const raw =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_SERVICE
    : process.env.NEXT_PUBLIC_API_SERVICE_DEV || process.env.NEXT_PUBLIC_API_SERVICE;
const BACKEND = ((raw || 'http://localhost:8000').trim()).replace(/\/api\/?$/, '');

/** PDF yuklash: 1MB+ fayllar uchun body limit 50MB — rewrite o‘rniga shu route ishlatiladi */
export const config = {
  api: {
    bodyParser: false, // body ni o‘zimiz 50MB limit bilan o‘qiymiz (streamRequestBody)
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const folder = (req.query.folder as string) || 'articles';
  const url = `${BACKEND}/api/file/save-pdf?folder=${encodeURIComponent(folder)}`;

  const headers: Record<string, string> = {};
  if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;
  const contentType = req.headers['content-type'];
  if (contentType) headers['Content-Type'] = contentType;

  const UPLOAD_TIMEOUT_MS = 180000; // 3 daqiqa — katta PDF uchun

  try {
    const body = await streamRequestBody(req, 50 * 1024 * 1024);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
    const backendRes = await fetch(url, {
      method: 'POST',
      headers,
      body: body as unknown as BodyInit,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const data = await backendRes.json().catch(() => ({}));
    res.status(backendRes.status).json(data);
  } catch (err: any) {
    if (err.message === 'Payload too large') {
      return res.status(413).json({ message: 'Fayl 50 MB dan katta' });
    }
    console.error('[save-pdf proxy]', err?.message || err);
    res.status(500).json({ message: err?.message || 'Network Error' });
  }
}

function streamRequestBody(
  req: NextApiRequest,
  maxBytes: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    req.on('data', (chunk: Buffer) => {
      total += chunk.length;
      if (total > maxBytes) {
        req.destroy();
        reject(new Error('Payload too large'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks as unknown as Uint8Array[])));
    req.on('error', reject);
  });
}
