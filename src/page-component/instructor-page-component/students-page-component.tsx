import {
	Box,
	Button,
	Card,
	CardBody,
	Heading,
	Input,
	Stack,
	Table,
	TableCaption,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	Spinner,
	Flex,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { AiOutlineFieldNumber, AiOutlineReload } from 'react-icons/ai';
import SectionTitle from 'src/components/section-title/section-title';
import { useActions } from 'src/hooks/useActions';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import ErrorAlert from 'src/components/error-alert/error-alert';
import { courseusers } from 'src/config/constants';
import { getRoleFromToken } from 'src/helpers/token.helper';

Chart.register(CategoryScale);

// Chart data type definition
interface ChartDataType {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		backgroundColor: string[];
		borderColor: string;
		borderWidth: number;
	}[];
}

// Mock data for students (instructor o'z kurslaridagi studentlarni ko'radi)
const mockStudents = [
	{
		id: 1,
		email: 'polatovdoston250@gmail.com',
		fullName: 'Topilmadi',
		courses: 0,
		enrolledDate: '2025-05-21',
	},
	{
		id: 2,
		email: 'polatovdoston1002@gmail.com',
		fullName: 'Admin User',
		courses: 0,
		enrolledDate: '2025-05-13',
	},
	{
		id: 3,
		email: 'info@uydatalim.uzedu.uz',
		fullName: 'Admin User',
		courses: 0,
		enrolledDate: '2025-05-13',
	},
	{
		id: 4,
		email: 'togaevn25@gmail.com',
		fullName: 'superadmin user',
		courses: 0,
		enrolledDate: '2025-09-27',
	},
	{
		id: 5,
		email: 'togaevn14@gmail.com',
		fullName: 'instructor user',
		courses: 0,
		enrolledDate: '2025-09-27',
	},
	{
		id: 6,
		email: 'togaevn83@gmail.com',
		fullName: 'test user',
		courses: 0,
		enrolledDate: '2025-09-27',
	},
	{
		id: 7,
		email: 'sadullayevanihola06@gmail.com',
		fullName: 'admin admin',
		courses: 0,
		enrolledDate: '2025-05-30',
	},
	{
		id: 8,
		email: '30202821060037@oneid.uz',
		fullName: 'TO‘RAYEV RO‘ZIBEK OCHILOVICH',
		courses: 0,
		enrolledDate: '2025-09-13',
	},
	{
		id: 9,
		email: '62102075650055@oneid.uz',
		fullName: 'NURIDDINOVA ZAXRO NURIDDIN QIZI',
		courses: 0,
		enrolledDate: '2025-08-29',
	},
	{
		id: 10,
		email: '30603942180051@oneid.uz',
		fullName: 'ABDUKARIMOV SIROJIDDIN SAYFIDDIN O‘G‘LI',
		courses: 0,
		enrolledDate: '2025-08-29',
	},
];


const StudentsPageComponent = () => {
	const [limit, setLimit] = useState<number>(15);
	const [query, setQuery] = useState<string>('');
	const [students, setStudents] = useState(mockStudents);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [chartData, setChartData] = useState<ChartDataType>({
		labels: courseusers.map(data => data.year.toString()),
		datasets: [
			{
				label: 'Students Gained',
				data: courseusers.map(data => data.userGain),
				backgroundColor: ['rgba(75,192,192,1)', '#50AF95', '#f3ba2f', '#2a71d0'],
				borderColor: 'black',
				borderWidth: 2,
			},
		],
	});

	const { t } = useTranslation();
	const { user } = useTypedSelector(state => state.user);
	
	// ✅ SECURITY FIX: Role ni token dan o'qish (har safar backend dan)
	const userRole = getRoleFromToken();

	// Role tekshiruvi
	if (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
		return (
			<Box p={8} textAlign="center">
				<Text fontSize="xl" color="red.500">
					{t('access_denied', { ns: 'instructor' }) || 'Access denied. Instructor role required.'}
				</Text>
			</Box>
		);
	}

	// Qidiruv funksiyasi
	const handleSearch = () => {
		setIsLoading(true);
		setTimeout(() => {
			if (query.trim()) {
				const filteredStudents = mockStudents.filter(student =>
					student.fullName.toLowerCase().includes(query.toLowerCase()) ||
					student.email.toLowerCase().includes(query.toLowerCase())
				);
				setStudents(filteredStudents);
			} else {
				setStudents(mockStudents);
			}
			setIsLoading(false);
		}, 500);
	};

	// Ko'proq ma'lumot yuklash
	const loadMoreStudents = () => {
		setIsLoading(true);
		setTimeout(() => {
			// Bu yerda API chaqiruvini amalga oshirish mumkin
			setLimit(prev => prev + 5);
			setIsLoading(false);
		}, 1000);
	};

	// Enter bosganda qidirish
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	return (
		<>
			<Card>
				<CardBody>
					<Stack>
						<SectionTitle
							title={t('students_title', { ns: 'instructor' })}
							subtitle={t('students_description', { ns: 'instructor' })}
						/>
						<Box className='chart-container'>
							<Line
								data={chartData}
								options={{
									responsive: true,
									plugins: {
										title: { display: false },
										legend: { display: false },
									},
									scales: {
										x: {
											type: 'category',
										},
										y: {
											type: 'linear',
										},
									},
								}}
							/>
						</Box>
					</Stack>
				</CardBody>
			</Card>

			<Box mt={10}>
			<Heading>{t('all_users', { ns: 'instructor' })}</Heading>
			<Box pos={'relative'} mt={5}>
				<Input
					h={14}
					w={'full'}
					bg={useColorModeValue('white','gray.900')}
					color={useColorModeValue('gray.900', 'white')}
						placeholder={t('search_input_placeholder', { ns: 'courses' }) || ''}
						_placeholder={{ color: 'gray.500' }}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyPress={handleKeyPress}
					/>
					<Button 
						pos={'absolute'} 
						right={2} 
						top={2} 
						colorScheme={'gray'} 
						zIndex={999}
						onClick={handleSearch}
						isLoading={isLoading}
					>
						{t('search_input_btn', { ns: 'courses' })}
					</Button>
				</Box>
				
				<TableContainer mt={10}>
					<Table variant='striped' colorScheme='teal'>
						<TableCaption>
							<Button 
								colorScheme={'gray'} 
								variant={'outline'} 
								rightIcon={<AiOutlineReload />}
								isLoading={isLoading}
								onClick={loadMoreStudents}
							>
								{t('more', { ns: 'instructor' })}...
							</Button>
						</TableCaption>
						<Thead>
							<Tr>
								<Th isNumeric>
									<AiOutlineFieldNumber fontSize={20} />
								</Th>
								<Th>{t('email', { ns: 'instructor' })}</Th>
								<Th>{t('full_name', { ns: 'instructor' })}</Th>
								<Th>{t('courses', { ns: 'instructor' })}</Th>
								<Th>{t('enrolled_date', { ns: 'instructor' })}</Th>
							</Tr>
						</Thead>
						<Tbody>
							{isLoading && students.length === 0 ? (
								<Tr>
									<Td colSpan={5}>
										<Flex justify="center" align="center" h="200px">
											<Spinner size="lg" />
										</Flex>
									</Td>
								</Tr>
							) : students.length === 0 ? (
								<Tr>
									<Td colSpan={5}>
										<Flex justify="center" align="center" h="200px">
											<Text fontSize="lg" color="gray.500">
												{t('no_students_found', { ns: 'instructor' }) || 'No students found'}
											</Text>
										</Flex>
									</Td>
								</Tr>
							) : (
								students.map((student, idx) => (
									<Tr key={student.id}>
										<Td>{idx + 1}</Td>
										<Td>{student.email}</Td>
										<Td>{student.fullName}</Td>
										<Td>{student.courses}</Td>
										<Td>{new Date(student.enrolledDate).toLocaleDateString()}</Td>
									</Tr>
								))
							)}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>
		</>
	);
};

export default StudentsPageComponent;