import { GetServerSideProps } from 'next';
import { Box, Button, Heading, IconButton, Table, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { withAdminLayout } from 'src/layouts/admin';
import { getRoleFromToken } from 'src/helpers/token.helper';
import { AdminCollectionService } from 'src/services/admin-collection.service';
import { CollectionType } from 'src/interfaces/collection.interface';
import { MdDelete, MdEdit } from 'react-icons/md';
import Link from 'next/link';

const AdminCollectionsPage = () => {
	const router = useRouter();
	const toast = useToast();
	const userRole = getRoleFromToken();
	const [collections, setCollections] = useState<CollectionType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (userRole !== 'ADMIN') {
			router.push('/');
			return;
		}
		AdminCollectionService.getAll()
			.then(setCollections)
			.catch(() => setCollections([]))
			.finally(() => setLoading(false));
	}, [userRole, router]);

	const onDelete = async (id: string, title: string) => {
		if (!confirm(`"${title}" ni o'chirishni xohlaysizmi?`)) return;
		try {
			await AdminCollectionService.delete(id);
			setCollections((prev) => prev.filter((c) => c._id !== id));
			toast({ title: "O'chirildi", status: 'success' });
		} catch {
			toast({ title: 'Xatolik', status: 'error' });
		}
	};

	if (userRole !== 'ADMIN') return null;

	return (
		<Box py={10}>
			<Heading size="lg" mb={6}>Journal to&apos;plamlari</Heading>
			<Button as={Link} href="/admin/collections/create" colorScheme="blue" mb={4}>
				Yangi to&apos;plam
			</Button>
			{loading ? (
				<Box>Yuklanmoqda...</Box>
			) : (
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>Nomi</Th>
							<Th>Yil</Th>
							<Th>Holat</Th>
							<Th></Th>
						</Tr>
					</Thead>
					<Tbody>
						{collections.map((c) => (
							<Tr key={c._id}>
								<Td>{c.title}</Td>
								<Td>{c.year}</Td>
								<Td>{c.isPublished ? 'Nashr etilgan' : 'Qoralama'}</Td>
								<Td>
									<IconButton
										aria-label="Tahrirlash"
										icon={<MdEdit />}
										size="sm"
										as={Link}
										href={`/admin/collections/edit?id=${c._id}`}
										mr={2}
									/>
									<IconButton
										aria-label="O'chirish"
										icon={<MdDelete />}
										size="sm"
										colorScheme="red"
										onClick={() => onDelete(c._id, c.title)}
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

export default withAdminLayout(AdminCollectionsPage);

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	if (!req.cookies.refresh) return { redirect: { destination: '/auth', permanent: false } };
	return { props: {} };
};
