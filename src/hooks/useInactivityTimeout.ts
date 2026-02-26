import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useActions } from './useActions';
import { useAuth } from './useAuth';

interface UseInactivityTimeoutProps {
	timeoutMinutes?: number;
	onTimeout?: () => void;
	showWarning?: boolean;
	warningMinutes?: number;
	onWarning?: () => void;
}

export const useInactivityTimeout = ({
	timeoutMinutes = 10,
	onTimeout,
	showWarning = false,
	warningMinutes = 1, // 1 daqiqa oldin ogohlantirish
	onWarning,
}: UseInactivityTimeoutProps = {}) => {
	const { user } = useAuth();
	const { logout } = useActions();
	const router = useRouter();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastActivityRef = useRef<number>(Date.now());

	const resetTimeout = useCallback(() => {
		// Faqat kirgan foydalanuvchilar uchun timeout o'rnatish
		if (!user) return;

		// Avvalgi timeout larni to'xtatish
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if (warningTimeoutRef.current) {
			clearTimeout(warningTimeoutRef.current);
		}

		const timeoutMs = timeoutMinutes * 60 * 1000; // daqiqalarni millisekundga aylantirish
		const warningMs = warningMinutes * 60 * 1000;

		// Ogohlantirish timeout (agar kerak bo'lsa)
		if (showWarning && warningMs < timeoutMs) {
			warningTimeoutRef.current = setTimeout(() => {
				const now = Date.now();
				const timeSinceLastActivity = now - lastActivityRef.current;
				
				if (timeSinceLastActivity >= warningMs) {
					if (onWarning) {
						onWarning();
					}
				}
			}, warningMs);
		}

		// Asosiy timeout o'rnatish
		timeoutRef.current = setTimeout(() => {
			const now = Date.now();
			const timeSinceLastActivity = now - lastActivityRef.current;

			if (timeSinceLastActivity >= timeoutMs) {
				// Logout qilish va bosh sahifaga yo'naltirish
				logout();
				router.push('/');
				
				// Custom callback chaqirish
				if (onTimeout) {
					onTimeout();
				}
			}
		}, timeoutMs);
	}, [user, timeoutMinutes, warningMinutes, showWarning, logout, router, onTimeout, onWarning]);

	const updateActivity = useCallback(() => {
		lastActivityRef.current = Date.now();
		resetTimeout();
	}, [resetTimeout]);

	// Foydalanuvchi harakatini kuzatish
	useEffect(() => {
		if (!user) {
			// Foydalanuvchi kirilmagan bo'lsa timeout ni to'xtatish
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			return;
		}

		// Harakat hodisalarini kuzatish
		const events = [
			'mousedown',
			'mousemove',
			'keypress',
			'scroll',
			'touchstart',
			'click',
		];

		// Harakat hodisalarini qo'shish
		events.forEach(event => {
			document.addEventListener(event, updateActivity, true);
		});

		// Dastlabki timeout ni o'rnatish
		resetTimeout();

		// Cleanup function
		return () => {
			events.forEach(event => {
				document.removeEventListener(event, updateActivity, true);
			});
			
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			if (warningTimeoutRef.current) {
				clearTimeout(warningTimeoutRef.current);
			}
		};
	}, [user, updateActivity, resetTimeout]);

	// Component unmount bo'lganda timeout larni to'xtatish
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			if (warningTimeoutRef.current) {
				clearTimeout(warningTimeoutRef.current);
			}
		};
	}, []);

	return {
		updateActivity,
		resetTimeout,
	};
};
