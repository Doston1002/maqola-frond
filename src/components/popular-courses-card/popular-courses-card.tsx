import {
	Box,
	Flex,
	Heading,
	HStack,
	Icon,
	Stack,
	Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { CiViewList } from 'react-icons/ci';
import ReactStars from 'react-stars';
import { loadImage, formatRating } from 'src/helpers/image.helper';
import { PopularCoursesCardProps } from './popular-courses-card.props';

const PopularCoursesCard = ({ item }: PopularCoursesCardProps) => {
	return (
		<Stack key={item.title} spacing={3} p={3} cursor={'pointer'}>
			<Box pos={'relative'} w={'full'} h={'280px'}>
				<Image
					src={loadImage(item.previewImage)}
					alt={item.title}
					fill
					style={{ objectFit: 'cover', borderRadius: '10px' }}
				/>
			</Box>
			<HStack>
				<Text color={'#e59819'}>{formatRating(item.reviewAvg)}</Text>
				<ReactStars
					edit={false}
					value={item.reviewAvg || 5}
					color2={'#e59819'}
				/>
				<Text opacity={'.8'}>({item.reviewCount})</Text>
			</HStack>
			<Heading fontSize={'xl'}>{item.title}</Heading>
			<HStack>
				<Flex align={'center'} gap={1}>
					<Icon as={CiViewList} />
					<Text>{item.lessonCount} Fan</Text>
				</Flex>
				<Flex align={'center'} gap={1}>
					<Icon as={AiOutlineClockCircle} />
					<Text>{item.totalHour} Soat</Text>
				</Flex>
			</HStack>
		</Stack>
	);
};

export default PopularCoursesCard;
