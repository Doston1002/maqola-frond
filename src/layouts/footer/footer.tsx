import { Box, Flex, IconButton, Text, useColorModeValue } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaTelegram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
	const { t } = useTranslation();

	return (
		<Box
			pl={{ base: 0, lg: '320px' }}
			mt={10}
			w={'full'}
			borderTop={'1px'}
			bg={useColorModeValue('gray.50', 'gray.900')}
			color={useColorModeValue('gray.700', 'gray.200')}
			borderTopColor={useColorModeValue('gray.200', 'gray.700')}
			h={'10vh'}
		>
			<Flex justify={'space-between'} align={'center'} h={'full'} px={4}>
				<Text>
					© {format(new Date(), 'yyyy')} Uyda Ta'lim {t('footer', { ns: 'layout' })}
				</Text>
				<Flex gap={3} mr={2}>
					<a href="https://t.me/uzedu" target="_blank" rel="noopener noreferrer">
						<IconButton icon={<FaTelegram />} colorScheme={'gray'} variant={'outline'} aria-label={'telegram'} />
					</a>
					<a href="https://www.instagram.com/mmtv_uz/" target="_blank" rel="noopener noreferrer">
						<IconButton icon={<FaInstagram />} colorScheme={'gray'} variant={'outline'} aria-label={'instagram'} />
					</a>
					<a href="https://www.youtube.com/@Uydatalim" target="_blank" rel="noopener noreferrer">
						<IconButton icon={<FaYoutube />} colorScheme={'gray'} variant={'outline'} aria-label={'youtube'} />
					</a>
				</Flex>
			</Flex>
		</Box>
	);
};

export default Footer;
