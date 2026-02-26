import { Button, Grid, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import SectionTitle from 'src/components/section-title/section-title';
import { useRouter } from 'next/router';

const AboutPageComponent = () => {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<SectionTitle
				textAlign={'center'}
				title={t('about_title', { ns: 'global' })}
				subtitle={t('about_descrption', { ns: 'global' })}
			/>

			<Grid gridTemplateColumns={{ base: '100%', lg: '50% 50%' }} mt={10} gap={5}>
				<Image src={'/images/uy.png'} alt={'about png'} />
				<Stack justifySelf={'center'} spacing={4} alignSelf={'center'}>
					<Heading fontSize={'3xl'} color={'gray.500'}>
						{t('about_heading', { ns: 'global' })}
					</Heading>
					<Text>{t('about_text_1', { ns: 'global' })}</Text>
					<Button colorScheme={'gray'} h={14} variant={'outline'} w={'fit-content'} onClick={() => router.push('/courses')}>
						{t('about_btn', { ns: 'global' })}
					</Button>
				</Stack>
			</Grid>
		</>
	);
};

export default AboutPageComponent;
