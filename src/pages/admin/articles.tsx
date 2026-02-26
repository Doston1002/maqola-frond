import { GetServerSideProps } from 'next';
import { Box, Button, Heading, IconButton, Table, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { withAdminLayout } from 'src/layouts/admin';
import { getRoleFromToken } from 'src/helpers/token.helper';
import { AdminArticleService } from 'src/services/admin-article.service';
import { AdminCollectionService } from 'src/services/admin-collection.service';
import { ArticleType } from 'src/interfaces/article.interface';
import { CollectionType } from 'src/interfaces/collection.interface';
import { MdDelete, MdEdit } from 'react-icons/md';
import Link from 'next/link';

const AdminArticlesPage = () => {
	const router = useRouter();
	const toast = useToast();
	const userRole = getRoleFromToken();
	const [articles, setArticles] = useState<ArticleType[]>([]);
	const [collections, setCollections] = useState<CollectionType[]>([]);
	const [loading, setLoading] = useState(true);
	const [filterCollectionId, setFilterCollectionId] = useState<string>('');

	useEffect(() => {
		if (userRole !== 'ADMIN') {
			router.push('/');
			return;
		}
		Promise.all([AdminArticleService.getAll(), AdminCollectionService.getAll()])
			.then(([arts, colls]) => {
				setArticles(arts);
				setCollections(colls);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, [userRole, router]);

	useEffect(() => {
		if (filterCollectionId && userRole === 'ADMIN') {
			AdminArticleService.getAll(filterCollectionId).then(setArticles);
		} else if (!filterCollectionId && userRole === 'ADMIN') {
			AdminArticleService.getAll().then(setArticles);
		}
	}, [filterCollectionId, userRole]);

	const onDelete = async (id: string, title: string) => {
		if (!confirm(`"${title}" ni o'chirishni xohlaysizmi?`)) return;
		try {
			await AdminArticleService.delete(id);
			setArticles((prev) => prev.filter((a) => a._id !== id));
			toast({ title: "O'chirildi", status: 'success' });
		} catch {
			toast({ title: 'Xatolik', status: 'error' });
		}
	};

	if (userRole !== 'ADMIN') return null;

	return (
		<Box py={10}>
			<Heading size="lg" mb={6}>Maqolalar</Heading>
			<Button as={Link} href="/admin/articles/create" colorScheme="blue" mb={4}>
				Yangi maqola
			</Button>
			<Box mb={4}>
				<Button
					size="sm"
					variant={filterCollectionId === '' ? 'solid' : 'outline'}
					onClick={() => setFilterCollectionId('')}
					mr={2}
				>
					Hammasi
				</Button>
				{collections.map((c) => (
					<Button
						key={c._id}
						size="sm"
						variant={filterCollectionId === c._id ? 'solid' : 'outline'}
						onClick={() => setFilterCollectionId(c._id)}
						mr={2}
					>
						{c.title}
					</Button>
				))}
			</Box>
			{loading ? (
				<Box>Yuklanmoqda...</Box>
			) : (
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>Sarlavha</Th>
							<Th>Muallif(lar)</Th>
							<Th>Holat</Th>
							<Th></Th>
						</Tr>
					</Thead>
					<Tbody>
						{articles.map((a) => (
							<Tr key={a._id}>
								<Td>{a.title}</Td>
								<Td>{a.authors || '-'}</Td>
								<Td>{a.isPublished ? 'Nashr etilgan' : 'Qoralama'}</Td>
								<Td>
									<IconButton
										aria-label="Tahrirlash"
										icon={<MdEdit />}
										size="sm"
										as={Link}
										href={`/admin/articles/edit?id=${a._id}`}
										mr={2}
									/>
									<IconButton
										aria-label="O'chirish"
										icon={<MdDelete />}
										size="sm"
										colorScheme="red"
										onClick={() => onDelete(a._id, a.title)}
									/>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			)}
		</Box>
	);
};

export default withAdminLayout(AdminArticlesPage);

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	if (!req.cookies.refresh) return { redirect: { destination: '/auth', permanent: false } };
	return { props: {} };
};
