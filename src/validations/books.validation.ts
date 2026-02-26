import * as Yup from 'yup';

export const BooksValidation = {
	createBooks() {
		return Yup.object({
			title: Yup.string().required('title_is_required'),
			category: Yup.string().required('category_is_required'),
		});
	},
};
