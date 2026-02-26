import {
	Box,
	Button,
	Card,
	CardBody,
	Container,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	Text,
	Textarea,
	useColorModeValue,
	useToast,
	Badge,
	Divider,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionService, Question } from 'src/services/question.service';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

const OnlineMentorPageComponent = () => {
	const { t } = useTranslation();
	const toast = useToast();
	const router = useRouter();
	const { user } = useTypedSelector(state => state.user);

	const [formData, setFormData] = useState({
		title: '',
		description: '',
	});
	const [loading, setLoading] = useState(false);
	const [questionsLoading, setQuestionsLoading] = useState(false);
	const [myQuestions, setMyQuestions] = useState<Question[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		if (user) {
			loadMyQuestions();
		}
	}, [user]);

	const loadMyQuestions = async (pageNum: number = 1) => {
		setQuestionsLoading(true);
		try {
			const response = await QuestionService.getMyQuestions('10', pageNum.toString());
			setMyQuestions(response.questions);
			setTotalPages(response.totalPages);
			setPage(pageNum);
		} catch (error) {
			console.error('Error loading questions:', error);
		} finally {
			setQuestionsLoading(false);
		}
	};

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async () => {
		if (!user) {
			toast({
				title: "Iltimos avval tizimga ro'yxatdan o'ting",
				description: "Online mentor xizmatidan foydalanish uchun ro'yxatdan o'ting",
				status: 'warning',
				duration: 5000,
				isClosable: true,
			});
			router.push('/auth');
			return;
		}

		if (!formData.title || !formData.description) {
			toast({
				title: 'Barcha maydonlarni to\'ldiring',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		if (formData.title.trim().length < 3) {
			toast({
				title: 'Mavzu kamida 3 ta belgidan iborat bo\'lishi kerak',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		if (formData.description.trim().length < 10) {
			toast({
				title: 'Savol kamida 10 ta belgidan iborat bo\'lishi kerak',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setLoading(true);
		try {
			await QuestionService.createQuestion({
				title: formData.title.trim(),
				description: formData.description.trim(),
			});

			toast({
				title: 'Savolingiz muvaffaqiyatli yuborildi',
				description: 'Tez orada javob olasiz',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});

			setFormData({ title: '', description: '' });
			loadMyQuestions();
		} catch (error: any) {
			console.error('Error submitting question:', error);
			
			// Backend validation xatolarini ko'rsatish
			let errorMessage = 'Iltimos qayta urinib ko\'ring';
			
			if (error.response?.data?.message) {
				if (Array.isArray(error.response.data.message)) {
					errorMessage = error.response.data.message.join(', ');
				} else {
					errorMessage = error.response.data.message;
				}
			}
			
			toast({
				title: 'Xatolik yuz berdi',
				description: errorMessage,
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
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
				return t('status_pending', { ns: 'global' });
			case 'answered':
				return t('status_answered', { ns: 'global' });
			case 'closed':
				return t('status_closed', { ns: 'global' });
			default:
				return status;
		}
	};

	return (
		<Container maxW="container.xl" py={10}>
			<Heading mb={6}>{t('online_mentor_title', { ns: 'global' })}</Heading>
			<Text fontSize="lg" mb={8}>
				{t('online_mentor_description', { ns: 'global' })}
			</Text>

			{/* Savol berish formasi */}
			<Card mb={10}>
				<CardBody>
					<Heading size="md" mb={4}>
						{t('ask_question', { ns: 'global' })}
					</Heading>
					<Stack spacing={4}>
						<FormControl isRequired>
							<FormLabel>{t('question_topic', { ns: 'global' })}</FormLabel>
							<Input
								name="title"
								type="text"
								placeholder={t('question_topic_placeholder', { ns: 'global' }) as string}
								value={formData.title}
								onChange={handleChange}
								bg={useColorModeValue('white', 'gray.900')}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>{t('question_label', { ns: 'global' })}</FormLabel>
							<Textarea
								name="description"
								placeholder={t('question_placeholder', { ns: 'global' }) as string}
								rows={6}
								value={formData.description}
								onChange={handleChange}
								bg={useColorModeValue('white', 'gray.900')}
							/>
						</FormControl>
						<Button
						w={'full'}
						h={14}
						colorScheme={'gray'}
						onClick={handleSubmit}
							isLoading={loading}
							loadingText={t('submitting', { ns: 'global' })}
						>
							{t('submit_question', { ns: 'global' })}
						</Button>
					</Stack>
				</CardBody>
			</Card>

			{/* Foydalanuvchining savollari */}
			{user && (
				<Box>
					<Heading size="md" mb={4}>
						{t('my_questions', { ns: 'global' })}
					</Heading>
					{questionsLoading ? (
						<Text>{t('loading', { ns: 'global' })}</Text>
					) : myQuestions.length === 0 ? (
						<Text>{t('no_questions', { ns: 'global' })}</Text>
					) : (
						<Stack spacing={4}>
							{myQuestions.map(question => (
								<Card key={question.id}>
									<CardBody>
										<Flex justify="space-between" align="start" mb={2}>
											<Heading size="sm">{question.title}</Heading>
											<Badge colorScheme={getStatusColor(question.status)}>
												{getStatusText(question.status)}
											</Badge>
										</Flex>
										<Text mb={2}>{question.description}</Text>
										<Text fontSize="sm" color="gray.500" mb={3}>
											{t('sent_on', { ns: 'global' })} {format(new Date(question.createdAt), 'dd.MM.yyyy HH:mm')}
										</Text>

										{question.answer && (
											<>
												<Divider my={3} />
												<Box
													bg={useColorModeValue('blue.50', 'blue.900')}
													p={4}
													borderRadius="md"
												>
													<Text fontWeight="bold" mb={2}>
														{t('answer', { ns: 'global' })}
													</Text>
													<Text>{question.answer}</Text>
													{question.answeredBy && (
														<Text fontSize="sm" color="gray.500" mt={2}>
															{t('answered_by', { ns: 'global' })} {question.answeredBy.fullName} -{' '}
															{question.answeredAt &&
																format(new Date(question.answeredAt), 'dd.MM.yyyy HH:mm')}
														</Text>
													)}
												</Box>
											</>
										)}
									</CardBody>
								</Card>
							))}
						</Stack>
					)}

					{totalPages > 1 && (
						<Flex justify="center" mt={6} gap={2}>
							<Button
								onClick={() => loadMyQuestions(page - 1)}
								disabled={page <= 1 || questionsLoading}
								isLoading={questionsLoading}
								size="sm"
							>
								{t('previous', { ns: 'global' })}
							</Button>
							<Text alignSelf="center">
								{page} / {totalPages}
							</Text>
							<Button
								onClick={() => loadMyQuestions(page + 1)}
								disabled={page >= totalPages || questionsLoading}
								isLoading={questionsLoading}
								size="sm"
							>
								{t('next', { ns: 'global' })}
							</Button>
						</Flex>
					)}
				</Box>
			)}
		</Container>
	);
};

export default OnlineMentorPageComponent;

