import { useState } from 'react';
import { Box, Container, Heading, Input, Button, SimpleGrid, Text, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { withLayout } from 'src/layouts/layout';
import Seo from 'src/layouts/seo/seo';
import { ArticleType } from 'src/interfaces/article.interface';
import { ArticleService } from 'src/services/article.service';

const ArticlesPage = () => {
	const router = useRouter();
	const [q, setQ] = useState((router.query.q as string) || '');
	const [year, setYear] = useState((router.query.year as string) || '');
	const [results, setResults] = useState<ArticleType[]>([]);
	const [searched, setSearched] = useState(false);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		setSearched(true);
		try {
			const list = await ArticleService.search({ q: q || undefined, year: year || undefined });
			setResults(list);
		} catch {
			setResults([]);
		}
	};

	return (
		<Seo metaTitle="Maqolalar qidiruv" metaDescription="Maqola, muallif yoki kalit so'z bo'yicha qidirish">
			<Container maxW="container.lg" py={10}>
				<Heading size="lg" mb={6}>Maqolalar qidiruv</Heading>
				<Box as="form" onSubmit={handleSearch} mb={8}>
					<Box display="flex" gap={3} flexWrap="wrap">
						<Input
							placeholder="Maqola nomi, muallif, kalit so'z..."
							value={q}
							onChange={(e) => setQ(e.target.value)}
							maxW="300px"
						/>
						<Input
							placeholder="Yil (masalan 2024)"
							value={year}
							onChange={(e) => setYear(e.target.value)}
							maxW="120px"
						/>
						<Button type="submit" colorScheme="blue">Qidirish</Button>
					</Box>
				</Box>
				{searched && (
					<SimpleGrid columns={{ base: 1 }} spacing={4}>
						{results.length === 0 ? (
							<Text>Maqolalar topilmadi.</Text>
						) : (
							results.map((a) => (
								<Box key={a._id} p={4} borderWidth="1px" borderRadius="md">
									<Link
										onClick={(e) => {
											e.preventDefault();
											router.push(`/articles/${a.slug}`);
										}}
										fontWeight="medium"
									>
										{a.title}
									</Link>
									{a.authors && <Text fontSize="sm" color="gray.600">{a.authors}</Text>}
									{a.abstract && <Text noOfLines={2} fontSize="sm" mt={2}>{a.abstract}</Text>}
								</Box>
							))
						)}
					</SimpleGrid>
				)}
			</Container>
		</Seo>
	);
};

export default withLayout(ArticlesPage);
