import { GetServerSideProps } from 'next';
import { Box, Container, Heading, Text, Button } from '@chakra-ui/react';
import { withLayout } from 'src/layouts/layout';
import type { AppProviderProps } from 'src/layouts/layout.props';
import Seo from 'src/layouts/seo/seo';
import { useTranslation } from 'react-i18next';
import { ArticleType } from 'src/interfaces/article.interface';
import { ArticleService } from 'src/services/article.service';
import { getFullAssetUrl, getPdfViewerUrl } from 'src/config/api.config';
import { SafeHtml } from 'src/components/safe-html/safe-html';
import { getLocalized, resolveLocale } from 'src/helpers/locale.helper';

interface ArticleSlugPageProps extends AppProviderProps {
	article: ArticleType;
	[key: string]: unknown;
}

const ArticleSlugPage = ({ article }: ArticleSlugPageProps) => {
	const { i18n } = useTranslation();
	const locale = resolveLocale(i18n.resolvedLanguage);
	const title = getLocalized(article as object, 'title', locale);
	const abstract = getLocalized(article as object, 'abstract', locale);
	const keywordsText = getLocalized(article as object, 'keywords', locale) || (article.keywords?.length ? article.keywords.join(', ') : '');
	const pdfHref = getFullAssetUrl(article.pdfUrl);
	const pdfViewerSrc = getPdfViewerUrl(article.pdfUrl);

	const handleDownload = () => {
		ArticleService.recordDownload(article.slug).catch(() => {});
		window.open(pdfHref, '_blank');
	};

	return (
		<Seo metaTitle={title} metaDescription={abstract || title} children={
			<Container maxW="container.lg" py={10}>
				<Heading size="xl" mb={4}>{title}</Heading>
				{article.authors && <Text fontWeight="medium" mb={2}>Muallif(lar): {article.authors}</Text>}
				<Text fontSize="sm" color="gray.600" mb={4}>
					{typeof article.collectionId === 'object' && article.collectionId && 'year' in article.collectionId
						? (article.collectionId as any).year
						: ''} • Koʻrilganlar: {article.viewCount ?? 0} • Yuklab olishlar: {article.downloadCount ?? 0}
				</Text>
				{abstract && (
					<Box mb={4}>
						<Heading size="sm" mb={2}>Annotatsiya</Heading>
						<SafeHtml html={abstract} className="ql-editor" />
					</Box>
				)}
				{keywordsText && (
					<Box mb={4}>
						<Text as="span" fontWeight="medium">Kalit soʻzlar: </Text>
						<Text as="span">{keywordsText}</Text>
					</Box>
				)}
				{article.doi && <Text fontSize="sm" color="gray.600" mb={4}>DOI: {article.doi}</Text>}
				{pdfViewerSrc && (
					<>
						<Box mb={6}>
							<Button colorScheme="blue" size="lg" onClick={handleDownload}>
								PDF koʻrish / yuklab olish
							</Button>
						</Box>
						<Box as="iframe" src={pdfViewerSrc} w="100%" minH="600px" h="800px" borderRadius="md" title="PDF" />
					</>
				)}
			</Container>
		} />
	);
};

export default withLayout<ArticleSlugPageProps>(ArticleSlugPage);

export const getServerSideProps: GetServerSideProps<ArticleSlugPageProps> = async ({ params }) => {
	const slug = params?.slug as string;
	if (!slug) return { notFound: true };
	try {
		const article = await ArticleService.getBySlug(slug);
		return { props: { article } };
	} catch {
		return { notFound: true };
	}
};
