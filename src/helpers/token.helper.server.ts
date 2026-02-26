import { RoleUser } from 'src/interfaces/constants.interface';

/**
 * Server-side JWT Token dan role ni decode qilish (middleware uchun)
 * @param token - JWT token
 * @returns Role yoki null
 */
export const getRoleFromTokenServer = (token: string): RoleUser | null => {
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

