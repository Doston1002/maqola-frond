import { GetServerSideProps } from 'next';
import Head from 'next/head';
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
import { siteConfig } from 'src/config/site.config';

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
	const url = `${siteConfig.baseURL}/articles/${article.slug}`;

	const collection = typeof article.collectionId === 'object' && article.collectionId
		? (article.collectionId as any)
		: null;
	const collectionTitle = collection ? getLocalized(collection as object, 'title', locale) : '';
	const collectionYear = collection?.year;

	// Google Scholar: plain text abstract (strip HTML)
	const plainAbstract = (typeof abstract === 'string' && abstract)
		? abstract.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
		: '';
	// Publication date for Scholar: year or ISO date
	const publicationDate = collectionYear
		? String(collectionYear)
		: (article.createdAt ? new Date(article.createdAt).toISOString().slice(0, 10) : '');
	// Authors list for citation_author (one meta per author)
	const authorList = (article.authors || '')
		.split(/[,;]/)
		.map((a) => a.trim())
		.filter(Boolean);

	const handleDownload = () => {
		ArticleService.recordDownload(article.slug).catch(() => {});
		window.open(pdfHref, '_blank');
	};

	const ogImageUrl = collection?.coverImage ? getFullAssetUrl(collection.coverImage) : undefined;
	const breadcrumbList = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Bosh sahifa', item: siteConfig.baseURL },
			{ '@type': 'ListItem', position: 2, name: 'To\'plamlar', item: `${siteConfig.baseURL}/collections` },
			...(collection ? [{ '@type': 'ListItem' as const, position: 3, name: collectionTitle, item: `${siteConfig.baseURL}/collections/${collection.slug}` }] : []),
			{ '@type': 'ListItem', position: collection ? 4 : 3, name: title, item: url },
		],
	};

	return (
		<Seo
			metaTitle={title}
			metaDescription={plainAbstract || title}
			canonicalUrl={url}
			ogImage={ogImageUrl}
			ogType="article"
			children={
			<Container maxW="container.lg" py={10}>
				<Head>
					<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
					{/* Google Scholar: citation meta tags (Highwire Press) */}
					<meta name="citation_title" content={title} />
					{authorList.length > 0
						? authorList.map((author) => (
							<meta key={author} name="citation_author" content={author} />
						))
						: article.authors && <meta name="citation_author" content={article.authors} />}
					{publicationDate && <meta name="citation_publication_date" content={publicationDate} />}
					{plainAbstract && <meta name="citation_abstract" content={plainAbstract} />}
					{pdfHref && <meta name="citation_pdf_url" content={pdfHref} />}
					{collectionTitle && <meta name="citation_journal_title" content={collectionTitle} />}
					{siteConfig.siteName && <meta name="citation_publisher" content={siteConfig.siteName} />}
					{article.doi && <meta name="citation_doi" content={article.doi} />}
					{keywordsList.length > 0 && (
						<meta name="citation_keywords" content={keywordsList.join(', ')} />
					)}
					<meta name="citation_language" content={locale === 'uz' ? 'uz' : locale === 'ru' ? 'ru' : 'en'} />
					{article.createdAt && (
						<meta name="citation_online_date" content={new Date(article.createdAt).toISOString().slice(0, 10)} />
					)}

					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify({
								'@context': 'https://schema.org',
								'@type': 'ScholarlyArticle',
								headline: title,
								author: authorList.length > 0
									? authorList.map((name) => ({ '@type': 'Person', name }))
									: (article.authors ? { '@type': 'Person', name: article.authors } : undefined),
								datePublished: publicationDate || article.createdAt,
								description: plainAbstract || title,
								url,
								keywords: keywordsList.length ? keywordsList.join(', ') : undefined,
								isPartOf: collectionTitle ? { '@type': 'PublicationVolume', name: collectionTitle } : undefined,
								...(pdfHref && { associatedMedia: { '@type': 'MediaObject', contentUrl: pdfHref, encodingFormat: 'application/pdf' } }),
								...(article.doi && { identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: article.doi } }),
							}),
						}}
					/>
				</Head>
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
							<Box mb={6} sx={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
								<Heading size="md" mb={3}>Abstract</Heading>
								<SafeHtml html={abstract} className="ql-editor article-abstract" />
							</Box>
						)}

						{pdfViewerSrc && (
							<>
								<Box mb={2}>
									<Button colorScheme="blue" size="md" onClick={handleDownload}>
										PDF
									</Button>
									<Text fontSize="sm" color="gray.600" mt={2}>
										Agar PDF yuqorida ko&apos;rinmasa, &quot;PDF&quot; tugmasi orqali yangi oynada oching.
									</Text>
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
		}
		/>
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
