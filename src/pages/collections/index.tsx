import { GetServerSideProps } from 'next';
import { Box, Container, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { withLayout } from 'src/layouts/layout';
import type { AppProviderProps } from 'src/layouts/layout.props';
import Seo from 'src/layouts/seo/seo';
import { siteConfig } from 'src/config/site.config';
import { useTranslation } from 'react-i18next';
import { CollectionType } from 'src/interfaces/collection.interface';
import { CollectionService } from 'src/services/collection.service';
import { getAssetSrc } from 'src/config/api.config';
import { getLocalized, resolveLocale } from 'src/helpers/locale.helper';

interface CollectionsPageProps extends AppProviderProps {
	collections: CollectionType[];
	[key: string]: unknown;
}

const CollectionsPage = ({ collections }: CollectionsPageProps) => {
	const router = useRouter();
	const { i18n } = useTranslation();
	const locale = resolveLocale(i18n.resolvedLanguage);
	const url = `${siteConfig.baseURL}/collections`;

	return (
		<Seo metaTitle="Journal to'plamlari" metaDescription="Barcha ilmiy journal to'plamlari" canonicalUrl={url}>
			<Container maxW="container.xl" py={10}>
				<Heading size="lg" mb={6}>Journal to&apos;plamlari</Heading>
				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
					{collections.map((c) => (
						<Box
							key={c._id}
							p={5}
							shadow="md"
							borderWidth="1px"
							borderRadius="lg"
							cursor="pointer"
							_hover={{ shadow: 'lg', borderColor: 'blue.200' }}
							onClick={() => router.push(`/collections/${c.slug}`)}
						>
							{c.coverImage && (
								<Box
									as="img"
									src={getAssetSrc(c.coverImage)}
									alt={getLocalized(c as object, 'title', locale)}
									mb={3}
									h="140px"
									objectFit="cover"
									w="100%"
									borderRadius="md"
								/>
							)}
							<Heading size="sm">{getLocalized(c as object, 'title', locale)}</Heading>
							<Text fontSize="sm" color="gray.600" mt={1}>{c.year} yil</Text>
							<Text noOfLines={3} fontSize="sm" mt={2}>
								{(getLocalized(c as object, 'description', locale) || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim()}
							</Text>
							<Text
								mt={3}
								color="blue.600"
								fontWeight="medium"
								fontSize="sm"
							>
								Ko&apos;rish →
							</Text>
						</Box>
					))}
				</SimpleGrid>
			</Container>
		</Seo>
	);
};

export default withLayout<CollectionsPageProps>(CollectionsPage);

export const getServerSideProps: GetServerSideProps<CollectionsPageProps> = async () => {
	try {
		const collections = await CollectionService.getAll();
		return { props: { collections: collections || [] } };
	} catch {
		return { props: { collections: [] } };
	}
};
