import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { withLayout } from 'src/layouts/layout';
import Seo from 'src/layouts/seo/seo';
import { resolveLocale } from 'src/helpers/locale.helper';
import { siteConfig } from 'src/config/site.config';

const CONTENT = {
	uz: {
		title: 'Nashr etika',
		metaDesc: 'Ilmiy nashr etika talablari va qoidalari',
		docTitle: 'ILMIY NASHR ETIKA TALABLARI VA QOIDALARI',
		section1: 'Mualliflarning mas\'uliyati va majburiyatlari',
		section1Intro: 'Mualliflar jurnalga maqola topshirar ekan, quyidagi talablarga so\'zsiz rioya qilishlari shart:',
		section2: 'Tahririyat hay\'atining etik tamoyillari',
		section2Intro: 'Jurnal tahririyati "ochiqlik va xolislik" tamoyili asosida ish yuritadi:',
		items: {
			originality: 'Asllik va plagiatga yo\'l qo\'yilmasligi: Maqola original boʻlishi va boshqa nashrlarda chop etilmagan bo\'lishi kerak. Oʻzganing fikri yoki tadqiqot natijasidan foydalanilganda iqtibos (citation) keltirish majburiydir.',
			accuracy: 'Ma\'lumotlarning haqqoniyligi: Annotatsiyada ta\'kidlanganidek, keltirilgan statistik ko\'rsatkichlar va ilmiy faktlarning aniqligi uchun muallif shaxsan javobgar. Soxtalashtirilgan ma\'lumotlar (fabrication) qat\'iyan man etiladi.',
			authorship: 'Mualliflik huquqi: Maqola mualliflari ro\'yxatiga tadqiqotga bevosita hissa qo\'shgan shaxslargina kiritilishi lozim.',
			conflict: 'Manfaatlar to\'qnashuvi: Muallif tadqiqot natijasiga ta\'sir ko\'rsatishi mumkin bo\'lgan har qanday moliyaviy yoki shaxsiy manfaatlar to\'qnashuvi haqida tahririyatni ogohlantirishi lozim.',
			discrimination: 'Kamsitishga yo\'l qo\'ymaslik: Maqolalar muallifning jinsi, irqi, diniy qarashlari yoki lavozimidan qat\'i nazar, faqatgina ilmiy qimmati va dolzarbligi asosida baholanadi.',
			confidentiality: 'Konfidentsiallik: Tahririyat ko\'rib chiqilayotgan maqola mazmunini nashr etilmaguncha uchinchi shaxslarga oshkor qilmasligi shart.',
			decisions: 'Qaror qabul qilish: Maqolani chop etish yoki rad etish haqidagi yakuniy qaror taqrizchilar xulosasi va tahririyat kengashi muhokamasi asosida qabul qilinadi.',
		},
	},
	ru: {
		title: 'Этика публикации',
		metaDesc: 'Требования и правила этики научных публикаций',
		docTitle: 'ТРЕБОВАНИЯ И ПРАВИЛА ЭТИКИ НАУЧНЫХ ПУБЛИКАЦИЙ',
		section1: 'Обязанности и ответственность авторов',
		section1Intro: 'При подаче статьи в журнал авторы должны неукоснительно соблюдать следующие требования:',
		section2: 'Этические принципы редакционного совета',
		section2Intro: 'Редакция журнала действует на основе принципов «открытости и беспристрастности»:',
		items: {
			originality: 'Оригинальность и недопущение плагиата: Статья должна быть оригинальной и не опубликованной в других изданиях. При использовании чужих идей или результатов исследований обязательно указание цитаты (citation).',
			accuracy: 'Достоверность информации: Как указано в аннотации, автор лично несёт ответственность за точность представленных статистических данных и научных фактов. Фабрикация данных (fabrication) категорически запрещена.',
			authorship: 'Авторство: В список авторов должны быть включены только лица, непосредственно внесшие вклад в исследование.',
			conflict: 'Конфликт интересов: Автор обязан уведомить редакцию о любых финансовых или личных конфликтах интересов, которые могут повлиять на результаты исследования.',
			discrimination: 'Недискриминация: Статьи оцениваются исключительно на основе их научной ценности и актуальности, независимо от пола, расы, религиозных убеждений или должности автора.',
			confidentiality: 'Конфиденциальность: Редакция не должна раскрывать содержание рассматриваемой статьи третьим лицам до её публикации.',
			decisions: 'Принятие решений: Окончательное решение о публикации или отклонении статьи принимается на основе заключений рецензентов и обсуждения редакционным советом.',
		},
	},
	en: {
		title: 'Publication ethics',
		metaDesc: 'Scientific publication ethics requirements and rules',
		docTitle: 'SCIENTIFIC PUBLICATION ETHICS REQUIREMENTS AND RULES',
		section1: 'Responsibilities and obligations of authors',
		section1Intro: 'When submitting an article to the journal, authors must strictly adhere to the following requirements:',
		section2: 'Ethical principles of the editorial board',
		section2Intro: 'The journal\'s editorial board operates on the principle of "openness and impartiality":',
		items: {
			originality: 'Originality and avoidance of plagiarism: The article must be original and not published in other publications. When using someone else\'s ideas or research results, it is mandatory to provide a citation.',
			accuracy: 'Accuracy of information: As noted in the annotation, the author is personally responsible for the accuracy of the statistical data and scientific facts presented. Fabricated information is strictly prohibited.',
			authorship: 'Authorship: Only individuals who have directly contributed to the research should be included in the list of authors.',
			conflict: 'Conflict of interest: The author must notify the editorial board of any financial or personal conflicts of interest that may influence the research results.',
			discrimination: 'Non-discrimination: Articles are evaluated solely based on their scientific value and relevance, regardless of the author\'s gender, race, religious beliefs, or position.',
			confidentiality: 'Confidentiality: The editorial board must not disclose the content of an article under review to third parties until it is published.',
			decisions: 'Decision making: The final decision on whether to publish or reject an article is made based on the reviewers\' conclusions and discussions within the editorial board.',
		},
	},
};

const PublicationEthicsPage = () => {
	const { i18n } = useTranslation();
	const locale = resolveLocale(i18n.resolvedLanguage);
	const c = CONTENT[locale];

	const canonicalUrl = `${siteConfig.baseURL}/publication-ethics`;
	return (
		<Seo metaTitle={c.title} metaDescription={c.metaDesc} canonicalUrl={canonicalUrl}>
			<Container maxW="container.md" py={10}>
				<Heading size="lg" mb={6}>{c.title}</Heading>
				<VStack align="stretch" spacing={6} textAlign="left">
					<Heading size="md" as="h2">{c.docTitle}</Heading>

					<Box>
						<Heading size="sm" as="h3" mb={2}>1. {c.section1}</Heading>
						<Text mb={3}>{c.section1Intro}</Text>
						<Box as="ul" pl={6} sx={{ '& li': { mb: 2 } }}>
							<Text as="li">{c.items.originality}</Text>
							<Text as="li">{c.items.accuracy}</Text>
							<Text as="li">{c.items.authorship}</Text>
							<Text as="li">{c.items.conflict}</Text>
						</Box>
					</Box>

					<Box>
						<Heading size="sm" as="h3" mb={2}>2. {c.section2}</Heading>
						<Text mb={3}>{c.section2Intro}</Text>
						<Box as="ul" pl={6} sx={{ '& li': { mb: 2 } }}>
							<Text as="li">{c.items.discrimination}</Text>
							<Text as="li">{c.items.confidentiality}</Text>
							<Text as="li">{c.items.decisions}</Text>
						</Box>
					</Box>
				</VStack>
			</Container>
		</Seo>
	);
};

export default withLayout(PublicationEthicsPage);
