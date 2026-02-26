import axios from 'axios';
import Cookies from 'js-cookie';
import $axios from 'src/api/axios';
import {
	API_URL,
	getAuthUrl,
	getMailUrl,
	getUserUrl,
} from 'src/config/api.config';
import {
	removeTokensCookie,
	saveTokensCookie,
} from 'src/helpers/auth.helper';
import { AuthUserResponse } from 'src/store/user/user.interface';

export const AuthService = {
	async register(email: string, password: string, recaptchaToken: string) {
		const response = await axios.post<AuthUserResponse>(
			`${API_URL}${getAuthUrl('register')}`,
			{
				email,
				password,
				recaptchaToken,
			}
		);

		if (response.data.accessToken) {
			saveTokensCookie(response.data);
		}

		return response;
	},

	async login(email: string, password: string, recaptchaToken?: string) {
		const body: { email: string; password: string; recaptchaToken?: string } = { email, password };
		if (recaptchaToken) body.recaptchaToken = recaptchaToken;
		const response = await axios.post<AuthUserResponse>(
			`${API_URL}${getAuthUrl('login')}`,
			body
		);

		if (response.data.accessToken) {
			saveTokensCookie(response.data);
		}

		return response;
	},

	/** Admin: faqat email va parol bilan kirish */
	async loginAdmin(email: string, password: string) {
		const response = await axios.post<AuthUserResponse>(
			`${API_URL}${getAuthUrl('login')}`,
			{ email, password }
		);
		if (response.data.accessToken) {
			saveTokensCookie(response.data);
		}
		return response;
	},

	async oneIdLogin(code: string) {
		const response = await axios.post<AuthUserResponse & { oneIdAccessToken?: string }>(
			`${API_URL}${getAuthUrl('oneid/callback')}`,
			{ code }
		);

		if (response.data.accessToken) {
			saveTokensCookie(response.data);
		}

		// OneID access_token ni localStorage ga saqlash (logout uchun)
		if (response.data.oneIdAccessToken) {
			localStorage.setItem('oneIdAccessToken', response.data.oneIdAccessToken);
		}

		return response;
	},

	async sendOtp(email: string, isUser: boolean, recaptchaToken?: string) {
		const response = await axios.post<'Success'>(
			`${API_URL}${getMailUrl('send-otp')}`,
			{
				email,
				isUser,
				recaptchaToken,
			}
		);

		return response;
	},

	async verifyOtp(email: string, otpVerification: string) {
		const response = await axios.post<'Success'>(
			`${API_URL}${getMailUrl('verify-otp')}`,
			{
				email,
				otpVerification,
			}
		);

		return response;
	},

	async editProfilePassword(email: string, password: string, token: string) {
		const response = await axios.put<'Success'>(
		  `${API_URL}${getUserUrl('edit-password')}`,
		  { email, password },
		  {
			headers: { 'Authorization': `Bearer ${token}` }
		  }
		);
		return response;
	  },

	async checkUser(email: string) {
		const respone = await axios.post<'user' | 'no-user'>(
			`${API_URL}${getAuthUrl('check-user')}`,
			{
				email,
			}
		);

		return respone.data;
	},

	async logout() {
		try {
			// Backend logout endpointini chaqirish - token ni blacklist ga qo'shish
			const accessToken = Cookies.get('access');
			if (accessToken) {
				try {
					await $axios.post(`${getAuthUrl('logout')}`);
				} catch (error) {
					// Xatolik bo'lsa ham davom etish (cookie larni tozalash kerak)
					console.error('Backend logout xatolik:', error);
				}
			}

			// OneID access_token ni localStorage dan olish
			const oneIdAccessToken = localStorage.getItem('oneIdAccessToken');

			// Agar OneID access_token bor bo'lsa, OneID logout endpointini chaqirish
			if (oneIdAccessToken) {
				try {
					await axios.post(
						`${API_URL}${getAuthUrl('oneid/logout')}`,
						{ access_token: oneIdAccessToken }
					);
				} catch (error) {
					// Xatolik bo'lsa ham davom etish (cookie larni tozalash kerak)
					console.error('OneID logout xatolik:', error);
				} finally {
					// OneID access_token ni localStorage dan o'chirish
					localStorage.removeItem('oneIdAccessToken');
				}
			}
		} catch (error) {
			console.error('Logout xatolik:', error);
		} finally {
			// Cookie larni tozalash (har doim)
			removeTokensCookie();
		}
	},

	async getNewTokens() {
		const refreshToken = Cookies.get('refresh');
		const response = await axios.post(
			`${API_URL}${getAuthUrl('access')}`,
			{ refreshToken }
		);

		if (response.data.accessToken) {
			saveTokensCookie(response.data);
		}

		return response;
	},

	async checkInstructor(token?: string) {
		try {
			const { data } = await axios.get(
				`${API_URL}${getAuthUrl('check-instructor')}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return data;
		} catch (error) {
			console.log(error);
		}
	},

	async updateUser(body) {
		try {
			const { data } = await $axios.put(
				`${getUserUrl('update')}`,
				body
			);

			return data;
		} catch (error) {
			console.log(error);
		}
	},

	async getTransactions() {
		try {
			const { data } = await $axios.get(
				`${getUserUrl('transactions')}`
			);

			return data;
		} catch (error) {
			console.log(error);
		}
	},

	async getMyCourses() {
		try {
			const { data } = await $axios.get(
				`${getUserUrl('my-courses')}`
			);

			return data;
		} catch (error) {
			console.log(error);
		}
	},

	async getSavedCards() {
		try {
			const { data } = await $axios.get(`/customer/saved-cards`);

			return data;
		} catch (error) {
			console.log(error);
		}
	},
};
