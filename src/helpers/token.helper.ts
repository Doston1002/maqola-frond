import Cookies from 'js-cookie';
import { RoleUser } from 'src/interfaces/constants.interface';

/**
 * JWT Token dan role ni decode qilish
 * @param token - JWT token (optional, agar berilmasa cookie dan oladi)
 * @returns Role yoki null
 */
export const getRoleFromToken = (token?: string): RoleUser | null => {
	try {
		// Agar token berilmasa, cookie dan olish
		const accessToken = token || Cookies.get('access');
		
		if (!accessToken) {
			return null;
		}

		// JWT token 3 qismdan iborat: header.payload.signature
		const parts = accessToken.split('.');
		
		if (parts.length !== 3) {
			return null;
		}

		// Payload ni decode qilish (base64)
		const payload = JSON.parse(atob(parts[1]));
		
		// Role ni olish
		const role = payload.role || payload.role || null;
		
		// Valid role tekshirish
		const validRoles: RoleUser[] = ['ADMIN', 'INSTRUCTOR', 'USER'];
		if (role && validRoles.includes(role as RoleUser)) {
			return role as RoleUser;
		}

		return null;
	} catch (error) {
		console.error('Token decode xatolik:', error);
		return null;
	}
};

/**
 * Token dan user ID ni olish
 * @param token - JWT token (optional, agar berilmasa cookie dan oladi)
 * @returns User ID yoki null
 */
export const getUserIdFromToken = (token?: string): string | null => {
	try {
		const accessToken = token || Cookies.get('access');
		
		if (!accessToken) {
			return null;
		}

		const parts = accessToken.split('.');
		
		if (parts.length !== 3) {
			return null;
		}

		const payload = JSON.parse(atob(parts[1]));
		
		return payload._id || payload.sub || null;
	} catch (error) {
		console.error('Token decode xatolik:', error);
		return null;
	}
};

/**
 * Token expire bo'lish vaqtini tekshirish
 * @param token - JWT token (optional, agar berilmasa cookie dan oladi)
 * @returns true agar token expire bo'lgan bo'lsa
 */
export const isTokenExpired = (token?: string): boolean => {
	try {
		const accessToken = token || Cookies.get('access');
		
		if (!accessToken) {
			return true;
		}

		const parts = accessToken.split('.');
		
		if (parts.length !== 3) {
			return true;
		}

		const payload = JSON.parse(atob(parts[1]));
		
		if (!payload.exp) {
			return true;
		}

		// Expire vaqtini tekshirish (seconds)
		const expirationTime = payload.exp * 1000; // milliseconds ga o'tkazish
		const currentTime = Date.now();

		return currentTime >= expirationTime;
	} catch (error) {
		console.error('Token decode xatolik:', error);
		return true;
	}
};

