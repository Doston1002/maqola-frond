import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side JWT Token dan role ni decode qilish (middleware uchun)
 */
const getRoleFromTokenServer = (token: string): 'ADMIN' | 'INSTRUCTOR' | 'USER' | null => {
	try {
		if (!token) {
			return null;
		}

		// JWT token 3 qismdan iborat: header.payload.signature
		const parts = token.split('.');
		
		if (parts.length !== 3) {
			return null;
		}

		// Payload ni decode qilish (base64)
		const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
		
		// Role ni olish
		const role = payload.role || null;
		
		// Valid role tekshirish
		const validRoles = ['ADMIN', 'INSTRUCTOR', 'USER'];
		if (role && validRoles.includes(role)) {
			return role as 'ADMIN' | 'INSTRUCTOR' | 'USER';
		}

		return null;
	} catch (error) {
		console.error('Token decode xatolik:', error);
		return null;
	}
};

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get('access')?.value;
	const refreshToken = request.cookies.get('refresh')?.value;

	// Dashboard va boshqa himoyalangan routelar
	const protectedRoutes = ['/dashboard', '/admin', '/instructor'];
	const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

	if (isProtectedRoute && !refreshToken) {
		// Agar token yo'q bo'lsa, login sahifasiga yo'naltirish
		return NextResponse.redirect(new URL('/', request.url));
	}

	// ✅ SECURITY FIX: Role tekshirish - token dan role ni o'qib, route ga qarab tekshirish
	if (isProtectedRoute && accessToken) {
		const userRole = getRoleFromTokenServer(accessToken);
		
		// Admin route uchun ADMIN role talab qilinadi
		if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
			return NextResponse.redirect(new URL('/', request.url));
		}
		
		// Instructor route uchun INSTRUCTOR yoki ADMIN role talab qilinadi
		if (pathname.startsWith('/instructor') && userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
			return NextResponse.redirect(new URL('/', request.url));
		}
	}

	// ✅ SECURITY FIX: Clickjacking protection - barcha response'larga security headerlar qo'shish
	const response = NextResponse.next();
	
	// X-Frame-Options header - clickjacking hujumlaridan himoya qilish
	response.headers.set('X-Frame-Options', 'DENY');
	
	// Content Security Policy:
	//  - frame-ancestors 'none'  -> bizning saytni boshqa saytlar iframe ichiga qo'ya olmaydi
	//  - frame-src youtube       -> biz o'zimiz YouTube videolarini iframe orqali qo'ya olamiz
	response.headers.set(
		'Content-Security-Policy',
		"frame-ancestors 'none'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 https://uydatalim.uzedu.uz https://api.uydatalim.uzedu.uz;"
	);
	
	// X-Content-Type-Options - MIME type sniffing'ni oldini olish
	response.headers.set('X-Content-Type-Options', 'nosniff');
	
	// X-XSS-Protection - Eski brauzerlar uchun qo'shimcha himoya
	response.headers.set('X-XSS-Protection', '1; mode=block');

	return response;
}

export const config = {
	// ✅ SECURITY FIX: Barcha route'larga security headerlar qo'shish
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	]
};
