import { Box, Container, Heading, SimpleGrid, Text, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { CollectionType } from 'src/interfaces/collection.interface';
import { getAssetSrc } from 'src/config/api.config';
import { CollectionService } from 'src/services/collection.service';
import { getLocalized, resolveLocale } from 'src/helpers/locale.helper';

interface HomePageProps {
	collections: CollectionType[];
	stats: { collectionsCount: number; articlesCount: number };
}

const HomePageComponent = ({ collections, stats }: HomePageProps) => {
	const router = useRouter();
	const { i18n } = useTranslation();
	const locale = resolveLocale(i18n.resolvedLanguage);

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement)?.value;
		if (q) router.push({ pathname: '/collections', query: { q } });
		else router.push('/collections');
	};

	return (
		<Container maxW="container.xl" py={10}>
			<Box textAlign="center" mb={10}>
				<Heading size="xl" mb={4}>Ilmiy maqolalar va journal to&apos;plamlari</Heading>
				<Text color="gray.600" fontSize="lg">
					Journal to&apos;plamlarini ko&apos;ring, maqolalarni o&apos;qing va PDF yuklab oling.
				</Text>
			</Box>

			<SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={10}>
				<Box bg="blue.50" p={6} borderRadius="lg" textAlign="center">
					<Heading size="2xl" color="blue.600">{stats.collectionsCount}</Heading>
					<Text mt={2}>Jami journal to&apos;plamlari</Text>
				</Box>
				<Box bg="green.50" p={6} borderRadius="lg" textAlign="center">
					<Heading size="2xl" color="green.600">{stats.articlesCount}</Heading>
					<Text mt={2}>Jami maqolalar</Text>
				</Box>
			</SimpleGrid>

			<Box as="form" onSubmit={handleSearch} mb={10}>
				<InputGroup size="lg" maxW="xl" mx="auto">
					<InputLeftElement pointerEvents="none" />
					<Input
						name="q"
						placeholder="Maqola, muallif yoki kalit soʻz boʻyicha qidirish..."
						borderRadius="full"
						bg="white"
						border="2px"
						borderColor="gray.200"
					/>
				</InputGroup>
			</Box>

			<Heading size="md" mb={4}>Soʻnggi journal toʻplamlari</Heading>
			<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
				{collections.slice(0, 6).map((c) => (
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
								mb={3}
								h="140px"
								w="100%"
								borderRadius="md"
								overflow="hidden"
								bg="gray.50"
								display="flex"
								alignItems="center"
								justifyContent="center"
							>
								<Box
									as="img"
									src={getAssetSrc(c.coverImage)}
									alt={getLocalized(c as object, 'title', locale)}
									maxH="140px"
									maxW="100%"
									w="auto"
									h="auto"
									objectFit="contain"
									objectPosition="center"
								/>
							</Box>
						)}
						<Heading size="sm">{getLocalized(c as object, 'title', locale)}</Heading>
						<Text fontSize="sm" color="gray.600" mt={1}>{c.year} yil</Text>
						<Text noOfLines={2} fontSize="sm" mt={2}>
							{((getLocalized(c as object, 'description', locale) || '') as string).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim()}
						</Text>
					</Box>
				))}
			</SimpleGrid>
			{collections.length > 6 && (
				<Box textAlign="center" mt={8}>
					<Text
						as="button"
						color="blue.600"
						fontWeight="semibold"
						onClick={() => router.push('/collections')}
					>
						Barcha toʻplamlar →
					</Text>
				</Box>
			)}
		</Container>
	);
};

export default HomePageComponent;

export async function getHomePageData() {
	try {
		const [collections, stats] = await Promise.all([
			CollectionService.getAll(),
			CollectionService.getStats(),
		]);
		return { collections: collections || [], stats: stats || { collectionsCount: 0, articlesCount: 0 } };
	} catch {
		return { collections: [], stats: { collectionsCount: 0, articlesCount: 0 } };
	}
}
