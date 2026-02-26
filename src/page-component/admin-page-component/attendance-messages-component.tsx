import {
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	Flex,
	Heading,
	HStack,
	Select,
	Stack,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useToast,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ContactService, ContactMessage } from 'src/services/contact.service';
import { ErrorAlert } from 'src/components';
import SectionTitle from 'src/components/section-title/section-title';

const AttendanceMessagesComponent = () => {
	const { t } = useTranslation();
	const toast = useToast();
	
	const [messages, setMessages] = useState<ContactMessage[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [unreadCount, setUnreadCount] = useState(0);

	const loadMessages = async (pageNum: number = 1) => {
		setLoading(true);
		setError(null);
		
		try {
			const response = await ContactService.getMessages('10', pageNum.toString(), 'attendance');
			setMessages(response.contacts);
			setTotalPages(response.totalPages);
			setPage(pageNum);
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to load messages';
			setError(errorMessage);
			console.error('Error loading messages:', err);
		} finally {
			setLoading(false);
		}
	};

	const loadUnreadCount = async () => {
		try {
			const response = await ContactService.getUnreadCount();
			setUnreadCount(response.unreadCount);
		} catch (err) {
			console.error('Error loading unread count:', err);
		}
	};

	useEffect(() => {
		loadMessages();
		loadUnreadCount();
	}, []);

	const handleMarkAsRead = async (id: string) => {
		if (!id) {
			toast({
				title: 'Invalid message ID',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		try {
			await ContactService.markAsRead(id);
			toast({
				title: 'Message marked as read',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
			loadMessages(page);
			loadUnreadCount();
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to mark as read';
			toast({
				title: errorMessage,
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			console.error('Error marking as read:', err);
		}
	};

	const handleStatusChange = async (id: string, status: 'pending' | 'replied' | 'closed') => {
		if (!id) {
			toast({
				title: 'Invalid message ID',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		try {
			await ContactService.updateStatus(id, status);
			toast({
				title: 'Status updated',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
			loadMessages(page);
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to update status';
			toast({
				title: errorMessage,
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			console.error('Error updating status:', err);
		}
	};

	const handleDelete = async (id: string) => {
		if (!id) {
			toast({
				title: 'Invalid message ID',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		if (!confirm('Are you sure you want to delete this message?')) return;
		
		try {
			await ContactService.deleteMessage(id);
			toast({
				title: 'Message deleted',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
			loadMessages(page);
			loadUnreadCount();
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to delete message';
			toast({
				title: errorMessage,
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			console.error('Error deleting message:', err);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending': return 'yellow';
			case 'replied': return 'green';
			case 'closed': return 'red';
			default: return 'gray';
		}
	};

	return (
		<>
			<Card>
				<CardBody>
					<Stack>
						<SectionTitle
							title={t('attendance_monitoring', { ns: 'admin' })}
							subtitle={t('attendance_monitoring_descr', { ns: 'admin' })}
						/>
					</Stack>
				</CardBody>
			</Card>

			<Box mt={10}>
				{error && <ErrorAlert title={error} clearHandler={() => setError(null)} />}
				
				<TableContainer>
					<Table variant="striped" colorScheme="teal">
						<Thead>
							<Tr>
								<Th>Ism</Th>
								<Th>Ma'lumotlar</Th>
								<Th>Status</Th>
								<Th>Sana</Th>
								<Th>Amallar</Th>
							</Tr>
						</Thead>
						<Tbody>
							{messages.map((message) => (
								<Tr key={message.id}>
									<Td>
										<Text fontWeight="bold">{message.fullName}</Text>
										{!message.isRead && (
											<Badge colorScheme="red" size="sm" ml={2}>NEW</Badge>
										)}
									</Td>
									<Td>
										<Stack spacing={1}>
											<Text fontSize="sm"><strong>O'qituvchi:</strong> {message.teacherName}</Text>
											<Text fontSize="sm"><strong>Hudud:</strong> {message.region}</Text>
											<Text fontSize="sm"><strong>Tuman:</strong> {message.district}</Text>
											<Text fontSize="sm"><strong>Maktab:</strong> {message.school}</Text>
											<Text fontSize="sm"><strong>Sinf:</strong> {message.schoolClass}</Text>
											<Text fontSize="sm"><strong>Fan:</strong> {message.subject}</Text>
											<Text fontSize="sm"><strong>Holat:</strong> {message.isAbsent ? "O'qituvchi darsga kelmadi" : "O'qituvchi kelmadi degan gap yo'q"}</Text>
											<Text fontSize="sm"><strong>Dars olib borishi:</strong> {message.teachingMethod}</Text>
										</Stack>
									</Td>
									<Td>
										<Badge colorScheme={getStatusColor(message.status)}>
											{message.status}
										</Badge>
									</Td>
									<Td>
										<Text fontSize="sm">
											{format(new Date(message.createdAt), 'dd MMM yyyy, HH:mm')}
										</Text>
									</Td>
									<Td>
										<HStack spacing={2}>
											{!message.isRead && (
												<Button
													size="sm"
													colorScheme="blue"
													onClick={() => handleMarkAsRead(message.id)}
												>
													Mark Read
												</Button>
											)}
											<Select
												size="sm"
												value={message.status}
												onChange={(e) => handleStatusChange(message.id, e.target.value as any)}
												w="120px"
											>
												<option value="pending">Pending</option>
												<option value="replied">Replied</option>
												<option value="closed">Closed</option>
											</Select>
											{/* <Button
												size="sm"
												colorScheme="red"
												onClick={() => handleDelete(message.id)}
											>
												Delete
											</Button> */}
										</HStack>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</TableContainer>

				<Flex justify="center" mt={4} gap={2}>
					<Button
						onClick={() => loadMessages(page - 1)}
						disabled={page <= 1}
						isLoading={loading}
					>
						Previous
					</Button>
					<Text>Page {page} of {totalPages}</Text>
					<Button
						onClick={() => loadMessages(page + 1)}
						disabled={page >= totalPages}
						isLoading={loading}
					>
						Next
					</Button>
				</Flex>
			</Box>
		</>
	);
};

export default AttendanceMessagesComponent;

