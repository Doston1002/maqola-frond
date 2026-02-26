import {
	Box,
	Button,
	Flex,
	Grid,
	HStack,
	Text,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineDownload, AiOutlineEye } from 'react-icons/ai';
import SectionTitle from 'src/components/section-title/section-title';
import { booksCategory } from 'src/config/constants';
import { loadImage } from 'src/helpers/image.helper';
import { useTypedSelector } from 'src/hooks/useTypedSelector';

const BooksPageComponent = () => {
	const [filter, setFilter] = useState<string>('all-categories');

	const { t } = useTranslation();
	const { books } = useTypedSelector(state => state.books);

	const filteredData = useCallback(() => {
		switch (filter) {
			case '1-sinf':
				return books.filter(c => c.category === '1-sinf');
			case '2-sinf':
				return books.filter(c => c.category === '2-sinf');
			case '3-sinf':
				return books.filter(c => c.category == '3-sinf');
			case '4-sinf':
				return books.filter(c => c.category == '4-sinf');
			case '5-sinf':
				return books.filter(c => c.category == '5-sinf');
			case '6-sinf':
						return books.filter(c => c.category == '6-sinf');
						case '7-sinf':
							return books.filter(c => c.category === '7-sinf');
						case '8-sinf':
							return books.filter(c => c.category === '8-sinf');
						case '9-sinf':
							return books.filter(c => c.category == '9-sinf');
						case '10-sinf':
							return books.filter(c => c.category == '10-sinf');
						case '11-sinf':
							return books.filter(c => c.category == '11-sinf');
						case 'fiction-books':
							return books.filter(
								c => c.category === 'fiction-books' || c.category === 'Badiiy kitoblar',
							);
						default:
							return books;
					}
				}, [filter, books]);

	return (
		<Box mb={2}>
			<Flex justify={'center'} mt={5} flexWrap={'wrap'}>
				{booksCategory.map((item, idx) => (
					<Button
						key={item.id}
						variant={filter == item.id ? 'solid' : 'outline'}
						borderRadius={0}
						borderLeftRadius={idx == 0 ? 'md' : 0}
						borderRightRadius={booksCategory.length - 1 === idx ? 'md' : 0}
						onClick={() => setFilter(item.id)}
					>
						{t(item.label, { ns: 'books' })}
					</Button>
				))}
			</Flex>

			<Grid
				gridTemplateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
				rowGap={1}
				gap={4}
				mt={5}
			>
				{filteredData().map(item => (
					<motion.div key={item._id} layout>
						<Box pos={'relative'}>
							<Box pos={'relative'} w={'full'} h={'150px'}>
								{/* <Image
									src={loadImage(item.image)}
									alt={item.title}
									fill
									style={{ borderRadius: '10px', objectFit: 'cover' }}
								/> */}
							</Box>
							<Box
								pos={'absolute'}
								minH={'90px'}
								borderRadius={'lg'}
								boxShadow={'dark-lg'}
								bg={'Background'}
								left={1}
								right={1}
								bottom={1}
								p={3}
							>
								{/* Title */}
								<Text fontWeight="bold" noOfLines={1} mb={3}>
									{item.title}
								</Text>
								
								{/* Tugmalar */}
								<HStack spacing={2} justify="center">
									{/* Ko'rish tugmasi */}
									<Button
										size="sm"
										colorScheme="blue"
										variant="solid"
									onClick={() => {
										// PDF faylni yangi tabda ochish
										window.open(loadImage(item.pdf), '_blank');
									}}
										leftIcon={<AiOutlineEye size={16} />}
										fontSize="xs"
									>
										{t('view', { ns: 'books' })}
									</Button>
									
									{/* Yuklab olish tugmasi */}
									<Button
										size="sm"
										colorScheme="green"
										variant="solid"
										onClick={async () => {
											try {
												const url = loadImage(item.pdf);
												
												// Faylni fetch qilish
												const response = await fetch(url, {
													method: 'GET',
													mode: 'cors',
												});
												
												if (!response.ok) {
													throw new Error('Fayl yuklanmadi');
												}
												
												// Blob yaratish
												const blob = await response.blob();
												
												// Download URL yaratish
												const downloadUrl = window.URL.createObjectURL(blob);
												
												// Link element yaratish va yuklash
												const link = document.createElement('a');
												link.href = downloadUrl;
												link.download = `${item.title}.pdf`;
												link.style.display = 'none';
												
												document.body.appendChild(link);
												link.click();
												document.body.removeChild(link);
												
												// Memory tozalash
												window.URL.revokeObjectURL(downloadUrl);
												
											} catch (error) {
												console.error('Yuklash xatosi:', error);
												
												// Fallback: oddiy yuklash
												const link = document.createElement('a');
												link.href = loadImage(item.pdf);
												link.download = `${item.title}.pdf`;
												link.target = '_blank';
												link.style.display = 'none';
												
												document.body.appendChild(link);
												link.click();
												document.body.removeChild(link);
											}
										}}
										leftIcon={<AiOutlineDownload size={16} />}
										fontSize="xs"
									>
										{t('download', { ns: 'books' })}
									</Button>
								</HStack>
							</Box>
						</Box>
					</motion.div>
				))}
			</Grid>
		</Box>
	);
};
export default BooksPageComponent;
