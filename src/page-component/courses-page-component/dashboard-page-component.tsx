// import {
// 	Box,
// 	Card,
// 	CardBody,
// 	Container,
// 	Divider,
// 	Heading,
// } from '@chakra-ui/react';
// import { useTypedSelector } from 'src/hooks/useTypedSelector';
// import Header from './header';
// import Sidebar from './sidebar';

// const DashboardPageComponent = () => {
// 	const { lesson } = useTypedSelector(state => state.lesson);
// 	if (!lesson) {
// 		return <Heading mt={5}>Ma'lumot topilmadi yoki yuklanmoqda...</Heading>;
// 	  }
// 	return (
// 		<>
// 			<Header />
// 			<Sidebar
// 				display={{ base: 'none', lg: 'block' }}
// 				position={'fixed'}
// 				top={'12vh'}
// 				right={'2vh'}
// 				bottom={'2vh'}
// 				w={'400px'}
// 			/>
// 			<Box
// 				mt={'12vh'}
// 				marginRight={{ base: 2, lg: '450px' }}
// 				marginLeft={{ base: 2, lg: 5 }}
// 			>
// 				<Container maxW={'container.lg'}>
// 					<Card>
// 						<CardBody>
							
// 						<Box dangerouslySetInnerHTML={{ __html: lesson?.embedVideo || '' }} />
// 						</CardBody>
// 					</Card>

// 					<Heading mt={5} as={'h2'}>
// 						{lesson.name}
// 					</Heading>
// 					<Divider mt={5} />
// 					<Box
// 						mt={5}
// 						css={{
// 							a: { color: 'teal', textDecoration: 'underline' },
// 							li: { listStyle: 'none' },
// 						}}
// 						dangerouslySetInnerHTML={{
// 							__html: lesson.material,
// 						}}
// 					/>
// 					<Sidebar
// 						display={{ base: 'block', lg: 'none' }}
// 						pos={'relative'}
// 						width={'100%'}
// 						mb={10}
// 					/>
// 				</Container>
// 			</Box>
// 		</>
// 	);
// };

// export default DashboardPageComponent;
import {
	Box,
	Card,
	CardBody,
	Container,
	Divider,
	Heading,
} from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import Header from './header';
import Sidebar from './sidebar';

const DashboardPageComponent = () => {
	const { lesson } = useTypedSelector(state => state.lesson);

	// YouTube embed URL xavfsizligini tekshiramiz
	const rawEmbed = (lesson?.embedVideo || '').toString();
	const safeEmbed =
		rawEmbed.includes('https://www.youtube.com/embed/') ||
		rawEmbed.includes('https://www.youtube-nocookie.com/embed/')
			? rawEmbed
			: '';

	return (
		<>
			<Header />
			<Sidebar
				display={{ base: 'none', lg: 'block' }}
				position={'fixed'}
				top={'12vh'}
				right={'2vh'}
				bottom={'2vh'}
				w={'400px'}
			/>
			<Box
				mt={'12vh'}
				marginRight={{ base: 2, lg: '450px' }}
				marginLeft={{ base: 2, lg: 5 }}
			>
				<Container maxW={'container.lg'}>
					<Card>
						<CardBody>
							<Box
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(safeEmbed, {
										ADD_TAGS: ['iframe'],
										ADD_ATTR: [
											'allow',
											'allowfullscreen',
											'frameborder',
											'referrerpolicy',
											'width',
											'height',
											'src',
											'title',
										],
									}),
								}}
							/>
						</CardBody>
					</Card>

					<Heading mt={5} as={'h2'}>
						{lesson?.name}
					</Heading>
					<Divider mt={5} />
					<Box
						mt={5}
						css={{
							a: { color: 'teal', textDecoration: 'underline' },
							li: { listStyle: 'none' },
						}}
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize((lesson?.material || '').toString()),
						}}
					/>
					<Sidebar
						display={{ base: 'block', lg: 'none' }}
						pos={'relative'}
						width={'100%'}
						mb={10}
					/>
				</Container>
			</Box>
		</>
	);
};

export default DashboardPageComponent;