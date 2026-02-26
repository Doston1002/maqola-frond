import { GetServerSideProps } from 'next';
import { Box, Container, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { withAdminLayout } from 'src/layouts/admin';
import $axios from 'src/api/axios';
import { getAdminUrl } from 'src/config/api.config';
import { getRoleFromToken } from 'src/helpers/token.helper';
import { useEffect, useState } from 'react';
import { ArticleType } from 'src/interfaces/article.interface';

interface DashboardData {
	collectionsCount: number;
	articlesCount: number;
	recentArticles: ArticleType[];
}

const AdminDashboard = () => {
	const router = useRouter();
	const userRole = getRoleFromToken();
	const [data, setData] = useState<DashboardData | null>(null);

	useEffect(() => {
		if (userRole !== 'ADMIN') {
			router.push('/');
			return;
		}
		$axios.get<DashboardData>(getAdminUrl('dashboard')).then((res) => setData(res.data)).catch(() => setData(null));
	}, [userRole, router]);

	if (userRole !== 'ADMIN') return null;
	if (!data) return <Container py={10}><Text>Yuklanmoqda...</Text></Container>;

	return (
		<Container maxW="container.lg" py={10}>
			<Heading size="lg" mb={6}>Dashboard</Heading>
			<SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={10}>
				<Box bg="blue.50" p={6} borderRadius="lg">
					<Heading size="2xl">{data.collectionsCount}</Heading>
					<Text mt={2}>Jami journal to&apos;plamlari</Text>
				</Box>
				<Box bg="green.50" p={6} borderRadius="lg">
					<Heading size="2xl">{data.articlesCount}</Heading>
					<Text mt={2}>Jami maqolalar</Text>
				</Box>
			</SimpleGrid>
			<Heading size="md" mb={4}>Oxirgi yuklangan maqolalar</Heading>
			<Box as="ul" listStyleType="none">
				{data.recentArticles.map((a) => (
					<Box key={a._id} as="li" py={2} borderBottomWidth="1px">
						<Text fontWeight="medium">{a.title}</Text>
						<Text fontSize="sm" color="gray.600">{a.authors}</Text>
					</Box>
				))}
				{(!data.recentArticles || data.recentArticles.length === 0) && <Text color="gray.500">Maqolalar yo&apos;q</Text>}
			</Box>
		</Container>
	);
};

export default withAdminLayout(AdminDashboard);

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	if (!req.cookies.refresh) {
		return { redirect: { destination: '/auth', permanent: false } };
	}
	return { props: {} };
};
