import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Container, Heading, Text, Link, Button, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { withLayout } from 'src/layouts/layout';
import type { AppProviderProps } from 'src/layouts/layout.props';
import Seo from 'src/layouts/seo/seo';
import { siteConfig } from 'src/config/site.config';
import { CollectionType } from 'src/interfaces/collection.interface';
import { ArticleType } from 'src/interfaces/article.interface';
import { CollectionService } from 'src/services/collection.service';
import { ArticleService } from 'src/services/article.service';
import { getAssetSrc, getFullAssetUrl, getPdfViewerUrl } from 'src/config/api.config';
import { getLocalized, resolveLocale } from 'src/helpers/locale.helper';

interface CollectionSlugPageProps extends AppProviderProps {
	collection: CollectionType;
	articles: ArticleType[];
	[key: string]: unknown;
}

const CollectionSlugPage = ({ collection, articles }: CollectionSlugPageProps) => {
	const router = useRouter();
	const { i18n } = useTranslation();
	const locale = resolveLocale(i18n.resolvedLanguage);
	const collectionTitle = getLocalized(collection as object, 'title', locale);
	const collectionDescription = getLocalized(collection as object, 'description', locale);
	const url = `${siteConfig.baseURL}/collections/${collection.slug}`;
	const ogImageUrl = collection.coverImage ? getFullAssetUrl(collection.coverImage) : undefined;
	const breadcrumbList = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Bosh sahifa', item: siteConfig.baseURL },
			{ '@type': 'ListItem', position: 2, name: 'To\'plamlar', item: `${siteConfig.baseURL}/collections` },
			{ '@type': 'ListItem', position: 3, name: collectionTitle, item: url },
		],
	};

	return (
		<Seo
			metaTitle={collectionTitle}
			metaDescription={collectionDescription}
			canonicalUrl={url}
			ogImage={ogImageUrl}
			children={
			<Container maxW="container.lg" py={10}>
				<Head>
					<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify({
								'@context': 'https://schema.org',
								'@type': 'Periodical',
								name: collectionTitle,
								description: collectionDescription,
								url,
								inLanguage: 'uz',
								issn: collection.slug,
							}),
						}}
					/>
				</Head>
				{collection.coverImage && (
					<Box
						as="img"
						src={getAssetSrc(collection.coverImage)}
						alt={collectionTitle}
						w="100%"
						maxH="400px"
						objectFit="contain"
						objectPosition="center"
						borderRadius="lg"
						mb={6}
						backgroundColor="gray.50"
					/>
				)}
				<Heading size="xl" mb={2}>{collectionTitle}</Heading>
				<Text color={useColorModeValue('gray.600', 'gray.200')} mb={4}>{collection.year} yil</Text>
				{collectionDescription && (
					<Box
						mb={8}
						className="collection-description"
						sx={{
							wordBreak: 'normal',
							overflowWrap: 'break-word',
							'& p': { mb: 2 },
							'& ul, & ol': { pl: 6, mb: 2 },
							'& li': { mb: 1 },
							'& strong': { fontWeight: 'bold' },
						}}
						dangerouslySetInnerHTML={{ __html: collectionDescription }}
					/>
				)}

				<Heading size="md" mb={4}>Maqolalar</Heading>
				<Box as="ul" listStyleType="none">
					{articles.map((a) => {
						const articleTitle = getLocalized(a as object, 'title', locale);
						const articleAbstract = getLocalized(a as object, 'abstract', locale);
						return (
						<Box
							key={a._id}
							as="li"
							p={4}
							mb={3}
							borderWidth="1px"
							borderRadius="md"
							_hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
						>
							<Link
								onClick={(e) => {
									e.preventDefault();
									router.push(`/articles/${a.slug}`);
								}}
								fontWeight="medium"
								color={useColorModeValue('gray.800', 'white')}
								_hover={{ textDecoration: 'none', color: useColorModeValue('blue.700', 'blue.200') }}
							>
								{articleTitle}
							</Link>
							{a.authors && <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.200')} mt={1}>{a.authors}</Text>}
							{articleAbstract && (
								<Text noOfLines={2} fontSize="sm" mt={2} color={useColorModeValue('gray.600', 'gray.200')}>
									{articleAbstract
										.replace(/<[^>]*>/g, ' ')
										.replace(/&nbsp;/g, ' ')
										.replace(/&amp;/g, '&')
										.replace(/&quot;/g, '"')
										.replace(/&#39;|&apos;/g, "'")
										.replace(/\s+/g, ' ')
										.trim()}
								</Text>
							)}
							<Button
								size="sm"
								colorScheme="blue"
								mt={2}
								as="a"
								href={getPdfViewerUrl(a.pdfUrl)}
								target="_blank"
								rel="noopener noreferrer"
							>
								PDF ochish
							</Button>
						</Box>
					); })}
				</Box>
			</Container>
		} />
	);
};

export default withLayout<CollectionSlugPageProps>(CollectionSlugPage);

export const getServerSideProps: GetServerSideProps<CollectionSlugPageProps> = async ({ params }) => {
	const slug = params?.slug as string;
	if (!slug) return { notFound: true };
	try {
		const collection = await CollectionService.getBySlug(slug);
		const collectionId = typeof collection._id === 'string' ? collection._id : (collection as any)._id;
		const articles = await ArticleService.getAll(collectionId);
		const list = Array.isArray(articles) ? articles : [];
		return { props: { collection, articles: list } };
	} catch {
		return { notFound: true };
	}
};
