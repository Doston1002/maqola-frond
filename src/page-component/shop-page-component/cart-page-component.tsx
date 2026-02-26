import {
	Box,
	Button,
	Divider,
	Flex,
	Grid,
	GridItem,
	Heading,
	HStack,
	IconButton,
	Stack,
	Tag,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import { ErrorAlert } from 'src/components';
import SectionTitle from 'src/components/section-title/section-title';
import { loadImage } from 'src/helpers/image.helper';
import { useActions } from 'src/hooks/useActions';
import { useTypedSelector } from 'src/hooks/useTypedSelector';

const CartPageComponent = () => {
	const [error, setError] = useState<string>('');

	const cart = useTypedSelector(state => state.cart);
	const router = useRouter();

	const getSubtitle = () => {
		let textCourse: string = '';
		let textBooks: string = '';
		const courses = cart.courses;
		const books = cart.books;

		textCourse = courses.length
			? `${courses.length} Courses in cart`
			: '';
		textBooks = books.length ? `${books.length} Books in cart` : '';
		const isAnd = courses.length ? true : false;

		return `${textCourse} ${isAnd ? 'and' : ''} ${textBooks}`;
	};

	return (
		<>
			<SectionTitle
				title={'Shopping cart'}
				subtitle={getSubtitle()}
			/>
			<Grid templateColumns={'70% 30%'} gap={5}>
				<GridItem>
					<Divider my={5} />
					{cart.books.map(book => (
						<Fragment key={book._id}>
							<ShoppingCartCard item={book} image={book.image} />
							<Divider my={5} />
						</Fragment>
					))}
					{cart.courses.map(book => (
						<Fragment key={book._id}>
							<ShoppingCartCard
								item={book}
								image={book.previewImage}
							/>
							<Divider my={5} />
						</Fragment>
					))}
				</GridItem>
				<GridItem>
					<Stack
						mt={5}
						border={'1px'}
						borderRadius={'md'}
						borderColor={useColorModeValue('gray.200', 'gray.700')}
						p={5}
					>
						<Button
							h={14}
							colorScheme={'gray'}
							borderRadius={0}
							onClick={() => router.push('/shop/success')}
						>
							Checkout/instructor/courses
						</Button>
						<Divider />
						{error && (
							<ErrorAlert
								title={error}
								clearHandler={() => setError('')}
							/>
						)}
					</Stack>
				</GridItem>
			</Grid>
		</>
	);
};

export default CartPageComponent;

const ShoppingCartCard = ({ item, image }) => {
	const { removeBookFromCart, removeCourseFromCart } = useActions();

	const removeCartItem = () => {
		if (item.previewImage) {
			removeCourseFromCart(item._id);
		} else {
			removeBookFromCart(item._id);
		}
	};

	return (
		<Flex justify={'space-between'}>
			<HStack>
				<Box pos={'relative'} w={'200px'} h={'100px'}>
					<Image
						fill
						src={loadImage(image)}
						alt={item.title}
						style={{ objectFit: 'cover', borderRadius: '10px' }}
					/>
				</Box>
				<Stack>
					<Heading fontSize={'xl'}>{item.title}</Heading>
					<Text>by Admin Platform</Text>
					<HStack>
						<Tag colorScheme={'gray'}>Books</Tag>
						<Tag colorScheme={'gray'}>Usefull</Tag>
						<Tag
							colorScheme={'gray'}
							textTransform={'capitalize'}
						>
							{item.category}
						</Tag>
					</HStack>
				</Stack>
			</HStack>
			<Stack spacing={0}>
				<Text
					color={'facebook.300'}
					fontSize={'2xl'}
					fontWeight={'bold'}
				>
				</Text>
				<IconButton
					aria-label='remove'
					icon={<BsFillTrashFill />}
					colorScheme={'red'}
					onClick={removeCartItem}
				/>
			</Stack>
		</Flex>
	);
};