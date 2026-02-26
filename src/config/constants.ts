import {
	AiOutlineDashboard,
	AiOutlineUnorderedList,
} from 'react-icons/ai';
import { CiViewList } from 'react-icons/ci';
import {
	FaBookReader,
	// FaChalkboardTeacher,
	FaDraftingCompass,
	FaFirstdraft,
	FaListAlt,
	FaQuestionCircle,
	FaUserGraduate,
} from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { ImBooks } from 'react-icons/im';
import { MdImportContacts, MdOutlineContactMail, MdOutlineCreateNewFolder, MdOutlineFactCheck } from 'react-icons/md';
import {
	CodingIcons,
	DesignIcons,
	EngIcons,
	FinishRightIcon,
	LaptopIcons,
	OnlineCourseIcon,
	OnlineLearningIcon,
	OnlineStudentIcon,
	PersonIcons,
	PrintIcons,
	RightLineIcon,
	RusIcons,
	TeachVal1Icon,
	TeachVal2Icon,
	TeachVal3Icon,
	UzbIcons,
} from 'src/icons';

export const courseCategory = [
    '1-sinf',
    '2-sinf',
    '3-sinf',
    '4-sinf',
    '5-sinf',
    '6-sinf',
    '7-sinf',
    '8-sinf',
    '9-sinf',
    '10-sinf',
    '11-sinf',
    "Qo'shimcha fanlar",
];
export const courseLevel = ['Boshlang\'ich', 'O\'rta', 'Professional'];

export const navigation = [
	{
		title: 'sidebar_title_1',
		links: [
			{ label: 'Bosh sahifa', route: '/', icon: AiOutlineDashboard },
			{ label: "Maqolalar qidiruv", route: '/articles', icon: MdImportContacts },
			{ label: "Journal to'plamlari", route: '/collections', icon: ImBooks },
			{ label: "Nashr etika", route: '/publication-ethics', icon: MdOutlineFactCheck },
			{ label: 'Arxiv', route: '/archive', icon: FaListAlt },
			{ label: "Bog'lanish", route: '/contact', icon: MdOutlineContactMail },
		],
	},
];

export const categories = [
	{
		name: 'design_category',
		id: 1,
		icon: DesignIcons,
	},
	
	{
		name: 'development_it_category',
		id: 3,
		icon: CodingIcons,
	},
	{
		name: 'engineering_architecture_category',
		id: 4,
		icon: PrintIcons,
	},
	{
		name: 'personl_development_category',
		id: 5,
		icon: PersonIcons,
	},
	{
		name: 'finance_accounting_category',
		id: 6,
		icon: LaptopIcons,
	},
];

// startup-client/src/config/constants.ts
export const trustedCompeny = [
	{
	  name: "Maktab va maktabgacha ta'lim vazirligi",
	  url: 'https://uzedu.uz/uz',
	  logo: '/images/logovazirlik.png', // logoni joylashuvi
	},
	
	{
	  name: 'Respublika tashxis markazi',
	  url: 'http://info-tashxis.uz/',
	  logo: '/images/tashxis.png',
	},
	{
	  name: "Maktab va maktabgacha ta'lim vazirligi",
	  url: 'https://uzedu.uz/uz',
	  logo: '/images/logovazirlik.png', // logoni joylashuvi
	},
	
	{
	  name: 'Respublika tashxis markazi',
	  url: 'http://info-tashxis.uz/',
	  logo: '/images/tashxis.png',
	},
	{
	  name: "Maktab va maktabgacha ta'lim vazirligi",
	  url: 'https://uzedu.uz/uz',
	  logo: '/images/logovazirlik.png', // logoni joylashuvi
	},
	
	{
	  name: 'Respublika tashxis markazi',
	  url: 'http://info-tashxis.uz/',
	  logo: '/images/tashxis.png',
	}
  ];

export const language = [
	{ nativeLng: "O'zbek", lng: 'uz', icon: UzbIcons },
	{ nativeLng: 'Русский', lng: 'ru', icon: RusIcons },
	{ nativeLng: 'English', lng: 'en', icon: EngIcons },
];

export const howItWorks = [
	{ title: 'how_it_works_first_step', icon: OnlineCourseIcon },
	{ title: '', icon: RightLineIcon },
	{ title: 'how_it_works_second_step', icon: OnlineLearningIcon },
	{ title: '', icon: FinishRightIcon },
	{ title: 'how_it_works_third_step', icon: OnlineStudentIcon },
];

export const coursesFilter = [
	{
		title: 'filter_category_title',
		id: 'category',
		categoryList: courseCategory.map(c => ({ name: c, id: c })),
	},
	// {
	// 	title: 'fitler_rating_title',
	// 	id: 'rating',
	// 	categoryList: [
	// 		{ name: 'fitler_rating_item_1', id: '4.5' },
	// 		{ name: 'fitler_rating_item_2', id: '4' },
	// 		{ name: 'fitler_rating_item_3', id: '3.5' },
	// 		{ name: 'fitler_rating_item_4', id: '3' },
	// 	],
	// },

	// --------------------------------------------------------------
	{
		title: 'filter_language_title',
		id: 'language',
		categoryList: [
			{ name: 'filter_language_item_1', id: 'uz' },
			{ name: 'filter_language_item_2', id: 'ru' },
			{ name: 'filter_language_item_3', id: 'en' },
		],
	},
];


export const createBooksCategory = [
	'1-sinf',
	'2-sinf',
	'3-sinf',
	'4-sinf',
	'5-sinf',
	'6-sinf',
	'7-sinf',
	'8-sinf',
	'9-sinf',
	'10-sinf',
	'11-sinf',
	'fiction-books',
];

export const booksCategory = [
	{
		label: 'filter_all_category',
		id: 'all-categories',
	},
	{
		label: '1-sinf',
		id: '1-sinf',
	},
	{
		label: '2-sinf',
		id: '2-sinf',
	},
	{
		label: '3-sinf',
		id: '3-sinf',
	},
	{
		label: '4-sinf',
		id: '4-sinf',
	},
	{
		label: '5-sinf',
		id: '5-sinf',
	},
	{
		label: '6-sinf',
		id: '6-sinf',
	},
	{
		label: '7-sinf',
		id: '7-sinf',
	},
	{
		label: '8-sinf',
		id: '8-sinf',
	},
	{
		label: '9-sinf',
		id: '9-sinf',
	},
	{
		label: '10-sinf',
		id: '10-sinf',
	},
	{
		label: '11-sinf',
		id: '11-sinf',
	},
	{
		label: 'fiction-books',
		id: 'fiction-books',
	},
	
];

export const faq = [
	{
		question: 'faq_question_1',
		answer: 'faq_answer_1',
	},
	{
		question: 'faq_question_2',
		answer: 'faq_answer_2',
	},
	{
		question: 'faq_question_3',
		answer: 'faq_answer_3',
	},
	{
		question: 'faq_question_4',
		answer: 'faq_answer_4',
	}
	
];

export const avatars = [
	{
		name: 'Segun Adebayo',
		url: 'https://bit.ly/sage-adebayo',
	},
	{
		name: 'Kent Dodds',
		url: 'https://bit.ly/kent-c-dodds',
	},
	{
		name: 'Prosper Otemuyiwa',
		url: 'https://bit.ly/prosper-baba',
	},
	{
		name: 'Christian Nwamba',
		url: 'https://bit.ly/code-beast',
	},
];

export const voiceLanguages = [
	{
		language: 'en',
		codes: 'en-US',
		voiceUrl: 'Google US English',
	},
	{
		language: 'ru',
		codes: 'ru-RU',
		voiceUrl: 'Milena',
	},
];

export const teachValues = [
	{
		title: 'teach_your_way',
		description: 'teach_your_way_description',
		icon: TeachVal1Icon,
	},
	{
		title: 'inspire_learners',
		description: 'inspire_learners_ddescription',
		icon: TeachVal2Icon,
	},
	{
		title: 'get_rewarded',
		description: 'get_rewarded_description',
		icon: TeachVal3Icon,
	},
];

export const instructorSidebar = [
	// {
	// 	name: 'sidebar_students',
	// 	icon: FaUserGraduate,
	// 	route: 'students',
	// },
	{
		name: 'sidebar_courses',
		icon: FaListAlt,
		route: 'courses',
	},
	{
		name: 'sidebar_create_course',
		icon: MdOutlineCreateNewFolder,
		route: 'create-course',
	},
	{
		name: 'sidebar_edit_courses',
		icon: FiEdit,
		route: 'edit-courses',
	},
	// {
	// 	name: 'sidebar_draft_courses',
	// 	icon: FaFirstdraft,
	// 	route: 'draft-courses',
	// },
];

export const courseusers = [
	{
		id: 1,
		email: 'ab@gmail.com',
		fullName: 'Samar Badriddinov',
		year: 2022,
		userGain: 100,
	},
	{
		id: 2,
		email: 'ab@gmail.com',
		fullName: 'Osman Ali',
		year: 2022,
		userGain: 450,
	},
	{
		id: 3,
		year: 2023,
		fullName: 'Shox Abdulloh',
		email: 'ab@gmail.com',
		userGain: 550,
	},
	{
		id: 4,
		year: 2023,
		fullName: 'Abdulaziz Alimov',
		email: 'ab@gmail.com',
		userGain: 1000,
	},
	{
		id: 5,
		year: 2023,
		fullName: 'Yusuf Khamdamov',
		email: 'ab@gmail.com',
		userGain: 1500,
	},
];

export const courseLng = [ 'uz', 'ru','en'];

export const adminSidebar = [
	{
		name: 'Dashboard',
		icon: AiOutlineDashboard,
		route: '',
	},
	{
		name: 'Journal to\'plamlari',
		icon: ImBooks,
		route: 'collections',
	},
	{
		name: 'Maqolalar',
		icon: MdImportContacts,
		route: 'articles',
	},
	{
		name: 'contact_messages',
		icon: MdOutlineContactMail,
		route: 'contact-messages',
	},
];
