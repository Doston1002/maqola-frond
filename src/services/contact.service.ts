import $axios from 'src/api/axios';
import { getContactUrl } from 'src/config/api.config';

export interface ContactMessage {
	id: string;
	fullName: string;
	phone?: string;
	message?: string;
	teacherName?: string;
	region?: string;
	district?: string;
	school?: string;
	schoolClass?: string;
	subject?: string;
	teachingMethod?: string;
	isAbsent?: boolean;
	type?: 'contact' | 'attendance';
	isRead: boolean;
	status: 'pending' | 'replied' | 'closed';
	createdAt: string;
}

export interface CreateContactDto {
	fullName: string;
	phone?: string;
	message?: string;
	teacherName?: string;
	region?: string;
	district?: string;
	school?: string;
	schoolClass?: string;
	subject?: string;
	teachingMethod?: string;
	isAbsent?: boolean;
	type?: 'contact' | 'attendance';
}

export interface ContactResponse {
	contacts: ContactMessage[];
	total: number;
	page: number;
	totalPages: number;
}

export const ContactService = {
	async sendMessage(data: CreateContactDto) {
		const response = await $axios.post(getContactUrl('send-message'), data);
		return response.data;
	},

	async getMessages(limit: string = '10', page: string = '1', type?: 'contact' | 'attendance') {
		const params: any = { limit, page };
		if (type) {
			params.type = type;
		}
		const { data } = await $axios.get<ContactResponse>(getContactUrl('messages'), {
			params,
		});
		return data;
	},

	async getUnreadCount() {
		const { data } = await $axios.get<{ unreadCount: number }>(getContactUrl('unread-count'));
		return data;
	},

	async getMessage(id: string) {
		const { data } = await $axios.get<ContactMessage>(getContactUrl(id));
		return data;
	},

	async markAsRead(id: string) {
		const { data } = await $axios.put(getContactUrl(`${id}/read`));
		return data;
	},

	async updateStatus(id: string, status: 'pending' | 'replied' | 'closed') {
		const { data } = await $axios.put(getContactUrl(`${id}/status`), { status });
		return data;
	},

	async deleteMessage(id: string) {
		const { data } = await $axios.delete(getContactUrl(id));
		return data;
	},
};
