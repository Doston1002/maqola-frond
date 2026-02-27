/**
 * Backend manzili — faqat shu joyda (global).
 * Development: NEXT_PUBLIC_API_SERVICE_DEV (masalan http://localhost:8000)
 * Production: NEXT_PUBLIC_API_SERVICE (masalan https://api.sizning-domeningiz.uz)
 */
const rawBackend =
  typeof process !== 'undefined' && process.env
    ? (process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_SERVICE
        : process.env.NEXT_PUBLIC_API_SERVICE_DEV || process.env.NEXT_PUBLIC_API_SERVICE)
    : undefined;

const BACKEND_BASE = ((rawBackend || 'http://localhost:8000').trim()).replace(/\/api\/?$/, '');

/** API so‘rovlari relative /api orqali — Next.js rewrite backendga yo‘naltiradi (CORS/CSP muammosiz) */
export const API_URL = '/api';
/** Backend asosiy URL (yuklab olish, yangi tab va server-side uchun) */
export const getBaseUrl = () => BACKEND_BASE;
/** Rasm yoki PDF uchun to'liq URL (yuklab olish / yangi tab uchun) */
export const getFullAssetUrl = (path: string | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = getBaseUrl();
  return base + (path.startsWith('/') ? path : '/' + path);
};

/** Rasm uchun same-origin path (rewrite orqali yuklanadi, rasmlar ko‘rinadi) */
export const getAssetSrc = (path: string | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return path.startsWith('/') ? path : '/' + path;
};

/** PDF ni iframe da ko‘rsatish uchun proxy URL (bloklanishsiz) */
export const getPdfViewerUrl = (path: string | undefined): string => {
  if (!path) return '';
  const p = path.startsWith('/') ? path : '/' + path;
  if (!p.startsWith('/uploads/')) return getFullAssetUrl(path);
  return '/api/proxy-pdf?path=' + encodeURIComponent(p);
};
export const ONEID_URL = `${BACKEND_BASE}/`;
export const getAuthUrl = (url: string) => `/auth/${url}`;
export const getFileUrl = (url: string) => (url ? `/file/${url}` : '/file');
export const getAdminUrl = (url: string) => (url ? `/admin/${url}` : '/admin');
export const getContactUrl = (url: string) => (url ? `/contact/${url}` : '/contact');
export const getCollectionsUrl = (url: string) => (url ? `/collections/${url}` : '/collections');
export const getArticlesUrl = (url: string) => (url ? `/articles/${url}` : '/articles');
export const getLessonUrl = (url: string) => (url ? `/lesson/${url}` : '/lesson');
export const getCourseUrl = (url: string) => (url ? `/course/${url}` : '/course');
export const getUserUrl = (url: string) => (url ? `/user/${url}` : '/user');
export const getInstructorUrl = (url: string) => (url ? `/instructor/${url}` : '/instructor');
export const getMailUrl = (url: string) => (url ? `/mail/${url}` : '/mail');
export const getBooksUrl = (url: string) => (url ? `/books/${url}` : '/books');
export const getReviewUrl = (url: string) => (url ? `/review/${url}` : '/review');
export const getQuestionUrl = (url: string) => (url ? `/question/${url}` : '/question');
export const getSectionUrl = (url: string) => (url ? `/section/${url}` : '/section');
