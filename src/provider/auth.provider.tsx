import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { FC, ReactNode, useEffect } from 'react';
import { useActions } from 'src/hooks/useActions';
import { useAuth } from 'src/hooks/useAuth';
import { useInactivityTimeout } from 'src/hooks/useInactivityTimeout';
import { getRoleFromToken } from 'src/helpers/token.helper';

interface Props {
	children: ReactNode;
}

const AuthProvider: FC<Props> = ({ children }): JSX.Element => {
	const { user, isLoading } = useAuth();
	const { logout, checkAuth } = useActions();
	const { pathname } = useRouter();

	// Inactivity timeout hook - 10 daqiqa davomida harakat bo'lmasa logout qiladi
	useInactivityTimeout({
		timeoutMinutes: 10,
		showWarning: true,
		warningMinutes: 1, // 1 daqiqa oldin ogohlantirish
		onWarning: () => {
			console.log('Ogohlantirish: 1 daqiqa ichida harakat qilmasangiz, tizimdan chiqarilasiz');
		},
		onTimeout: () => {
			console.log('Foydalanuvchi 10 daqiqa davomida harakat qilmadi, avtomatik logout qilindi');
		},
	});

	useEffect(() => {
		const refreshToken = Cookies.get('refresh');
		if (refreshToken) checkAuth();
	}, []);

	useEffect(() => {
		const refreshToken = Cookies.get('refresh');
		if (!refreshToken && user) logout();
	}, [pathname]);

	// Dashboard va boshqa himoyalangan routelar
	const protectedRoutes = ['/dashboard', '/admin', '/instructor'];
	const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

	// ✅ SECURITY FIX: Role ni token dan o'qish (har safar backend dan)
	const userRole = getRoleFromToken();

	useEffect(() => {
		if (!isLoading && isProtectedRoute && !user) {
			// Agar foydalanuvchi yo'q bo'lsa va himoyalangan route bo'lsa
			window.location.href = '/';
		}
	}, [user, isLoading, pathname, isProtectedRoute]);

	// ✅ SECURITY FIX: Role tekshirish - token dan role ni o'qib, route ga qarab tekshirish
	useEffect(() => {
		if (!isLoading && isProtectedRoute && userRole) {
			// Admin route uchun ADMIN role talab qilinadi
			if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
				window.location.href = '/';
			}
			
			// Instructor route uchun INSTRUCTOR yoki ADMIN role talab qilinadi
			if (pathname.startsWith('/instructor') && userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
				window.location.href = '/';
			}
		}
	}, [userRole, isLoading, pathname, isProtectedRoute]);

	return <>{children}</>;
};

export default AuthProvider;
