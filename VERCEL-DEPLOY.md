# Vercel da frontend deploy qilganda (Internal server error / Login 500)

Frontend Vercel da (`maqola-frond-j8c9.vercel.app`), backend esa boshqa serverda (masalan `http://89.39.95.12:8000`) bo‘lsa, **Vercel da Environment Variable** majburiy sozlanishi kerak.

## 1. Vercel da backend manzilini sozlash

1. [Vercel Dashboard](https://vercel.com/dashboard) → loyihangizni tanlang (maqola-frond)
2. **Settings** → **Environment Variables**
3. Quyidagi o‘zgaruvchini qo‘shing:

| Name | Value | Environment |
|------|--------|--------------|
| `NEXT_PUBLIC_API_SERVICE` | `http://89.39.95.12:8000` | Production, Preview, Development |

**Muhim:** Qiymatda bosh joy bo‘lmasin; `https://` yoki `http://` bilan yozing (backend SSL bo‘lsa `https://`).

4. **Save** tugmasini bosing.
5. **Redeploy** qiling: **Deployments** → oxirgi deploy → **⋯** → **Redeploy**.

Bundan keyin `/api/*` so‘rovlari Vercel tomonidan sizning backend serveringizga yo‘naltiriladi va login 500 xatosi ketadi.

## 2. Backend serverda CORS

Backendda Vercel domeni allaqachon ruxsat etilgan (`main.ts` da `https://maqola-frond-j8c9.vercel.app` qo‘shilgan). Agar yangi Vercel URL (masalan custom domain) ishlatsangiz, serverda `.env` yoki `ecosystem.config.js` da:

```env
FRONTEND_ORIGIN=https://yangi-domen.vercel.app
```

qo‘shing (yoki `allowedOrigins` ga qo‘lda qo‘shing).

## 3. Logo 404 (ixtiyoriy)

Agar `/images/logoDark.png` 404 bersa, `public/images/` papkasiga `logoDark.png` va kerak bo‘lsa `logoWhite.png` fayllarini qo‘ying. Fayllar bo‘lmasa, komponentda fallback ishlatiladi (sahifa ishlaydi, faqat logo ko‘rinmaydi).
