import {
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	Flex,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Stack,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Textarea,
	Th,
	Thead,
	Tr,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionService, Question } from 'src/services/question.service';
import { ErrorAlert } from 'src/components';
import SectionTitle from 'src/components/section-title/section-title';

const QuestionsPageComponent = () => {
	const { t } = useTranslation();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [questions, setQuestions] = useState<Question[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [unreadCount, setUnreadCount] = useState(0);
	const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
	const [answer, setAnswer] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('');

	const loadQuestions = async (pageNum: number = 1, status?: string) => {
		setLoading(true);
		setError(null);

		try {
			const response = await QuestionService.getAllQuestions(
				'10',
				pageNum.toString(),
				status || undefined,
			);
			setQuestions(response.questions);
			setTotalPages(response.totalPages);
			setPage(pageNum);
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to load questions';
			setError(errorMessage);
			console.error('Error loading questions:', err);
		} finally {
			setLoading(false);
		}
	};

	const loadUnreadCount = async () => {
		try {
			const response = await QuestionService.getUnreadCount();
			setUnreadCount(response.unreadCount);
		} catch (err) {
			console.error('Error loading unread count:', err);
		}
	};

	useEffect(() => {
		loadQuestions(1, statusFilter);
		loadUnreadCount();
	}, [statusFilter]);

	const handleMarkAsRead = async (id: string) => {
		try {
			await QuestionService.markAsRead(id);
			toast({
				title: 'O\'qilgan deb belgilandi',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
			loadQuestions(page, statusFilter);
			loadUnreadCount();
		} catch (err: any) {
			toast({
				title: err.response?.data?.message || 'Failed to mark as read',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleStatusChange = async (id: string, status: 'pending' | 'answered' | 'closed') => {
		try {
			await QuestionService.updateStatus(id, status);
			toast({
				title: 'Status yangilandi',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
			loadQuestions(page, statusFilter);
		} catch (err: any) {
			toast({
				title: err.response?.data?.message || 'Failed to update status',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Savolni o\'chirmoqchimisiz?')) return;

		try {
			await QuestionService.deleteQuestion(id);
			toast({
				title: 'Savol o\'chirildi',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
			loadQuestions(page, statusFilter);
			loadUnreadCount();
		} catch (err: any) {
			toast({
				title: err.response?.data?.message || 'Failed to delete question',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const openAnswerModal = (question: Question) => {
		setSelectedQuestion(question);
		setAnswer(question.answer || '');
		onOpen();
	};

	const handleSubmitAnswer = async () => {
		if (!selectedQuestion || !answer.trim()) {
			toast({
				title: 'Javobni kiriting',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		if (answer.trim().length < 10) {
			toast({
				title: 'Javob kamida 10 ta belgidan iborat bo\'lishi kerak',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		try {
			await QuestionService.answerQuestion({
				questionId: selectedQuestion.id,
				answer: answer.trim(),
			});

			toast({
				title: 'Javob muvaffaqiyatli yuborildi',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});

			onClose();
			setAnswer('');
			setSelectedQuestion(null);
			loadQuestions(page, statusFilter);
		} catch (err: any) {
			// Backend validation xatolarini ko'rsatish
			let errorMessage = 'Failed to submit answer';
			
			if (err.response?.data?.message) {
				if (Array.isArray(err.response.data.message)) {
					errorMessage = err.response.data.message.join(', ');
				} else {
					errorMessage = err.response.data.message;
				}
			}
			
			toast({
				title: errorMessage,
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'yellow';
			case 'answered':
				return 'green';
			case 'closed':
				return 'red';
			default:
				return 'gray';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending':
				return 'Kutilmoqda';
			case 'answered':
				return 'Javob berildi';
			case 'closed':
				return 'Yopildi';
			default:
				return status;
		}
	};

	return (
		<>
			<Card>
				<CardBody>
					<Stack>
						<SectionTitle
							title="Online Mentor Savollari"
							subtitle={`Jami savollar: ${questions.length} | O'qilmagan: ${unreadCount}`}
						/>
						<Flex gap={4} mt={4}>
							<Select
								value={statusFilter}
								onChange={e => setStatusFilter(e.target.value)}
								maxW="200px"
							>
								<option value="">Barchasi</option>
								<option value="pending">Kutilmoqda</option>
								<option value="answered">Javob berilgan</option>
								<option value="closed">Yopilgan</option>
							</Select>
						</Flex>
					</Stack>
				</CardBody>
			</Card>

			<Box mt={10}>
				{error && <ErrorAlert title={error} clearHandler={() => setError(null)} />}

				<TableContainer>
					<Table variant="striped" colorScheme="teal">
						<Thead>
							<Tr>
								<Th>Foydalanuvchi</Th>
								<Th>Mavzu</Th>
								<Th>Savol</Th>
								<Th>Status</Th>
								<Th>Sana</Th>
								<Th>Amallar</Th>
							</Tr>
						</Thead>
						<Tbody>
							{questions.map(question => (
								<Tr key={question.id}>
									<Td>
										<Stack spacing={0}>
											<Text fontWeight="bold">{question.user?.fullName}</Text>
											<Text fontSize="sm" color="gray.500">
												{question.user?.email}
											</Text>
										</Stack>
										{!question.isRead && (
											<Badge colorScheme="red" size="sm" ml={2}>
												NEW
											</Badge>
										)}
									</Td>
									<Td>
										<Text maxW="200px" isTruncated>
											{question.title}
										</Text>
									</Td>
									<Td>
										<Text maxW="300px" isTruncated>
											{question.description}
										</Text>
									</Td>
									<Td>
										<Badge colorScheme={getStatusColor(question.status)}>
											{getStatusText(question.status)}
										</Badge>
									</Td>
									<Td>
										<Text fontSize="sm">
											{format(new Date(question.createdAt), 'dd MMM yyyy, HH:mm')}
										</Text>
									</Td>
									<Td>
										<HStack spacing={2}>
											{!question.isRead && (
												<Button
													size="sm"
													colorScheme="blue"
													onClick={() => handleMarkAsRead(question.id)}
												>
													O'qildi
												</Button>
											)}
											<Button
												size="sm"
												colorScheme="green"
												onClick={() => openAnswerModal(question)}
											>
												{question.answer ? 'Javobni ko\'rish' : 'Javob berish'}
											</Button>
											<Select
												size="sm"
												value={question.status}
												onChange={e =>
													handleStatusChange(question.id, e.target.value as any)
												}
												w="140px"
											>
												<option value="pending">Kutilmoqda</option>
												<option value="answered">Javob berildi</option>
												<option value="closed">Yopildi</option>
											</Select>
											{/* <Button
												size="sm"
												colorScheme="red"
												onClick={() => handleDelete(question.id)}
											>
												O'chirish
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
						onClick={() => loadQuestions(page - 1, statusFilter)}
						disabled={page <= 1}
						isLoading={loading}
					>
						Oldingi
					</Button>
					<Text alignSelf="center">
						{page} / {totalPages}
					</Text>
					<Button
						onClick={() => loadQuestions(page + 1, statusFilter)}
						disabled={page >= totalPages}
						isLoading={loading}
					>
						Keyingi
					</Button>
				</Flex>
			</Box>

			{/* Answer Modal */}
			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{selectedQuestion?.answer ? 'Javob' : 'Javob berish'}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack spacing={4}>
							<Box>
								<Text fontWeight="bold" mb={2}>
									Mavzu:
								</Text>
								<Text>{selectedQuestion?.title}</Text>
							</Box>
							<Box>
								<Text fontWeight="bold" mb={2}>
									Savol:
								</Text>
								<Text>{selectedQuestion?.description}</Text>
							</Box>
							<Box>
								<Text fontWeight="bold" mb={2}>
									Foydalanuvchi:
								</Text>
								<Text>
									{selectedQuestion?.user?.fullName} ({selectedQuestion?.user?.email})
								</Text>
							</Box>
							<Box>
								<Text fontWeight="bold" mb={2}>
									Javob:
								</Text>
								<Textarea
									value={answer}
									onChange={e => setAnswer(e.target.value)}
									rows={8}
									placeholder="Javobingizni yozing..."
								/>
							</Box>
						</Stack>
					</ModalBody>

					<ModalFooter>
						<Button variant="ghost" mr={3} onClick={onClose}>
							Bekor qilish
						</Button>
						<Button colorScheme="green" onClick={handleSubmitAnswer}>
							Javob yuborish
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default QuestionsPageComponent;

