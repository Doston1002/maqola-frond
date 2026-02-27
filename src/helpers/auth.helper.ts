import Cookies from 'js-cookie';
import { AuthTokens } from 'src/store/user/user.interface';

const isSecure = typeof window !== 'undefined' && window.location?.protocol === 'https:';

export const saveTokensCookie = (data: AuthTokens) => {
	Cookies.set('access', data.accessToken, { path: '/', sameSite: 'lax', secure: isSecure });
	Cookies.set('refresh', data.refreshToken, { path: '/', sameSite: 'lax', secure: isSecure });
};

export const removeTokensCookie = () => {
	Cookies.remove('access');
	Cookies.remove('refresh');
};
