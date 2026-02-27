import { GetServerSideProps } from 'next';
import { Box, Container, Heading, Text, Button, SimpleGrid, Stack, Tag } from '@chakra-ui/react';
import { withLayout } from 'src/layouts/layout';
import type { AppProviderProps } from 'src/layouts/layout.props';
import Seo from 'src/layouts/seo/seo';
import { useTranslation } from 'react-i18next';
import { ArticleType } from 'src/interfaces/article.interface';
import { ArticleService } from 'src/services/article.service';
import { getAssetSrc, getFullAssetUrl, getPdfViewerUrl } from 'src/config/api.config';
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
	const keywordsList = keywordsText
		? keywordsText.split(',').map(k => k.trim()).filter(Boolean)
		: [];
	const pdfHref = getFullAssetUrl(article.pdfUrl);
	const pdfViewerSrc = getPdfViewerUrl(article.pdfUrl);

	const collection = typeof article.collectionId === 'object' && article.collectionId
		? (article.collectionId as any)
		: null;
	const collectionTitle = collection ? getLocalized(collection as object, 'title', locale) : '';
	const collectionYear = collection?.year;

	const handleDownload = () => {
		ArticleService.recordDownload(article.slug).catch(() => {});
		window.open(pdfHref, '_blank');
	};

	return (
		<Seo metaTitle={title} metaDescription={abstract || title} children={
			<Container maxW="container.lg" py={10}>
				<Box mb={6}>
					<Heading size="lg" textAlign="center" mb={3}>
						{title}
					</Heading>
					{article.authors && (
						<Text fontWeight="medium" textAlign="center" mb={1}>
							Muallif(lar): {article.authors}
						</Text>
					)}
					<Text fontSize="sm" color="gray.600" textAlign="center">
						{collectionTitle && `${collectionTitle} • `}{collectionYear ? `${collectionYear} yil • ` : ''}
						Koʻrilganlar: {article.viewCount ?? 0} • Yuklab olishlar: {article.downloadCount ?? 0}
					</Text>
				</Box>

				<SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
					<Box gridColumn={{ base: 'span 1', md: 'span 2' }}>
						{abstract && (
							<Box mb={6}>
								<Heading size="md" mb={3}>Abstract</Heading>
								<SafeHtml html={abstract} className="ql-editor" />
							</Box>
						)}

						{pdfViewerSrc && (
							<>
								<Box mb={4}>
									<Button colorScheme="blue" size="md" onClick={handleDownload}>
										PDF
									</Button>
								</Box>
								<Box
									as="iframe"
									src={pdfViewerSrc}
									w="100%"
									minH="600px"
									h="800px"
									borderRadius="md"
									title="PDF"
								/>
							</>
						)}
					</Box>

					<Box>
						{collection?.coverImage && (
							<Box
								as="img"
								src={getAssetSrc(collection.coverImage)}
								alt={collectionTitle || title}
								w="100%"
								maxH="260px"
								objectFit="cover"
								borderRadius="lg"
								mb={6}
							/>
						)}

						{keywordsList.length > 0 && (
							<Box mb={6}>
								<Heading size="sm" mb={3}>Keywords</Heading>
								<Stack direction="row" flexWrap="wrap" spacing={2}>
									{keywordsList.map((k) => (
										<Tag key={k} size="sm" colorScheme="gray" mr={1} mb={2}>
											{k}
										</Tag>
									))}
								</Stack>
							</Box>
						)}

						{article.doi && (
							<Box>
								<Heading size="sm" mb={2}>DOI</Heading>
								<Text fontSize="sm" color="gray.700">
									{article.doi}
								</Text>
							</Box>
						)}
					</Box>
				</SimpleGrid>
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
