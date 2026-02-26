import $axios from 'src/api/axios';
import { getQuestionUrl } from 'src/config/api.config';

export interface QuestionUser {
	id: string;
	fullName: string;
	email: string;
}

export interface Question {
	id: string;
	user: QuestionUser | null;
	title: string;
	description: string;
	answer?: string;
	answeredBy?: QuestionUser | null;
	answeredAt?: Date;
	status: 'pending' | 'answered' | 'closed';
	isRead: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateQuestionDto {
	title: string;
	description: string;
}

export interface AnswerQuestionDto {
	questionId: string;
	answer: string;
}

export interface QuestionsResponse {
	questions: Question[];
	total: number;
	page: number;
	totalPages: number;
}

export const QuestionService = {
	async createQuestion(data: CreateQuestionDto) {
		const response = await $axios.post(getQuestionUrl('create'), data);
		return response.data;
	},

	async getAllQuestions(limit: string = '10', page: string = '1', status?: string) {
		const params: any = { limit, page };
		if (status) {
			params.status = status;
		}
		const { data } = await $axios.get<QuestionsResponse>(getQuestionUrl('all'), {
			params,
		});
		return data;
	},

	async getMyQuestions(limit: string = '10', page: string = '1') {
		const { data } = await $axios.get<QuestionsResponse>(getQuestionUrl('my-questions'), {
			params: { limit, page },
		});
		return data;
	},

	async getUnreadCount() {
		const { data } = await $axios.get<{ unreadCount: number }>(getQuestionUrl('unread-count'));
		return data;
	},

	async getQuestion(id: string) {
		const { data } = await $axios.get(getQuestionUrl(id));
		return data;
	},

	async answerQuestion(data: AnswerQuestionDto) {
		const response = await $axios.post(getQuestionUrl('answer'), data);
		return response.data;
	},

	async markAsRead(id: string) {
		const { data } = await $axios.put(getQuestionUrl(`${id}/read`));
		return data;
	},

	async updateStatus(id: string, status: 'pending' | 'answered' | 'closed') {
		const { data } = await $axios.put(getQuestionUrl(`${id}/status`), { status });
		return data;
	},

	async deleteQuestion(id: string) {
		const { data } = await $axios.delete(getQuestionUrl(id));
		return data;
	},
};

