import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	HStack,
	Icon,
	Image,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { CiViewList } from 'react-icons/ci';
import { SiGoogleanalytics } from 'react-icons/si';
import ReactStars from 'react-stars';
import { loadImage, formatRating } from 'src/helpers/image.helper';
import { AllCoursesCardProps } from './all-courses-card.props';

const AllCoursesCard = ({
	course,
	isMyCourse,
}: AllCoursesCardProps) => {
	const router = useRouter();
	const onDetailedCourse = () =>
		router.push(`/courses/${course.slug}`);



	return (
		<>
			<Box py={4}>
				<Flex gap={4} direction={{ base: 'column', md: 'row' }}>
					<Image
						src={loadImage(course.previewImage)}
						alt={course.title}
						w={{ base: 'full', md: '250px' }}
						h={'250px'}
						borderRadius={'lg'}
						objectFit={'cover'}
						onClick={onDetailedCourse}
						cursor={'pointer'}
					/>
					<Stack>
						{!isMyCourse && course.reviewAvg !== undefined && (
							<HStack>
								<Text color={'#e59819'}>{formatRating(course.reviewAvg)}</Text>
								<ReactStars
									edit={false}
									value={course.reviewAvg || 5}
									color2={'#e59819'}
								/>
								<Text opacity={'.8'}>({course.reviewCount || 0})</Text>
							</HStack>
						)}
						<Heading fontSize={'xl'}>{course.title}</Heading>
						<Text>{course.exerpt}</Text>
						{!isMyCourse && course.author && (
							<Flex
								gap={2}
								fontSize={'14px'}
								direction={{ base: 'column', sm: 'row' }}
							>
								<Avatar
									src={loadImage(course.author.avatar)}
									name={course.author.fullName}
								/>
								<HStack>
									<Flex align={'center'} gap={1}>
										<Icon as={CiViewList} />
										<Text>{course.lessonCount || 0} lesson</Text>
									</Flex>
									<Flex align={'center'} gap={1}>
										<Icon as={AiOutlineClockCircle} />
										<Text>{course.totalHour || 0} hours</Text>
									</Flex>
									<Flex align={'center'} gap={1}>
										<Icon as={SiGoogleanalytics} />
										<Text>{course.level || 'Beginner'}</Text>
									</Flex>
								</HStack>
							</Flex>
						)}
						<Divider />
						<Flex
							align={{ base: 'flex-start', md: 'center' }}
							justify={'space-between'}
							direction={{ base: 'column', md: 'row' }}
						>
							<Flex gap={4} mt={{ base: 5, md: 0 }}>
								
								<Button
									onClick={onDetailedCourse}
									colorScheme={'gray'}
									variant={'outline'}
								>
									Batafsil
								</Button>
							</Flex>
						</Flex>
					</Stack>
				</Flex>
			</Box>
			<Divider />
		</>
	);
};

export default AllCoursesCard;