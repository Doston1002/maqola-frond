import { GetServerSideProps } from 'next';
import { Box, Container, Heading, Link, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { withLayout } from 'src/layouts/layout';
import type { AppProviderProps } from 'src/layouts/layout.props';
import Seo from 'src/layouts/seo/seo';
import { CollectionService } from 'src/services/collection.service';
import { CollectionType } from 'src/interfaces/collection.interface';

interface ArchivePageProps extends AppProviderProps {
	collectionsByYear: Record<number, CollectionType[]>;
	[key: string]: unknown;
}

const ArchivePage = ({ collectionsByYear }: ArchivePageProps) => {
	const router = useRouter();
	const years = Object.keys(collectionsByYear)
		.map(Number)
		.sort((a, b) => b - a);

	return (
		<Seo metaTitle="Arxiv" metaDescription="Yillar bo'yicha journal to'plamlari arxivi">
			<Container maxW="container.lg" py={10}>
				<Heading size="lg" mb={6}>Arxiv (yillar boʻyicha)</Heading>
				{years.map((year) => (
					<Box key={year} mb={6}>
						<Heading size="md" mb={3}>{year}</Heading>
						<Box as="ul" listStyleType="none">
							{collectionsByYear[year].map((c) => (
								<Box as="li" key={c._id} py={2}>
									<Link
										onClick={(e) => {
											e.preventDefault();
											router.push(`/collections/${c.slug}`);
										}}
										fontWeight="medium"
									>
										{c.title}
									</Link>
								</Box>
							))}
						</Box>
					</Box>
				))}
				{years.length === 0 && <Text>Hozircha arxiv boʻsh.</Text>}
			</Container>
		</Seo>
	);
};

export default withLayout<ArchivePageProps>(ArchivePage);

export const getServerSideProps: GetServerSideProps<ArchivePageProps> = async () => {
	try {
		const collections = await CollectionService.getAll();
		const collectionsByYear: Record<number, CollectionType[]> = {};
		collections.forEach((c) => {
			if (!collectionsByYear[c.year]) collectionsByYear[c.year] = [];
			collectionsByYear[c.year].push(c);
		});
		return { props: { collectionsByYear } };
	} catch {
		return { props: { collectionsByYear: {} } };
	}
};
