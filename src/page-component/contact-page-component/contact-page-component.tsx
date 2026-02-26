import {
	Button,
	Card,
	CardBody,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	Text,
	Textarea,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContactService } from 'src/services/contact.service';

const ContactPageComponent = () => {
	const { t } = useTranslation();
	const toast = useToast();

	// Form state
	const [formData, setFormData] = useState({ fullName: '', phone: '', message: '' });
	const [isLoading, setIsLoading] = useState(false);

	// Handle form input changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle form submission
	const handleSubmit = async () => {
		const { fullName, phone, message } = formData;

		// ✅ Telefon raqam validatsiyasi (bo‘shliqli yoki bo‘shliqsiz formatlar uchun)
		const phoneRegex = /^(\+998|998)?\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;

		if (!fullName || !phone || !message) {
			toast({
				title: 'Iltimos, barcha maydonlarni to‘ldiring.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		if (!phoneRegex.test(phone)) {
			toast({
				title: 'Telefon raqam noto‘g‘ri formatda. Masalan: +998901234567',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setIsLoading(true);

		try {
			await ContactService.sendMessage({ fullName, phone, message });

			toast({
				title: 'Habaringiz yuborildi. Tez orada aloqaga chiqamiz.',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});

			setFormData({ fullName: '', phone: '', message: '' });
		} catch (error) {
			console.error(error);
			toast({
				title: 'Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Flex
			h={'90vh'}
			w={'90vw'}
			justify={'flex-start'}
			direction={{ base: 'column', lg: 'row' }}
			align={'center'}
			gap={'4'}
		>
			<Card w={{ base: '100%', lg: '60%' }}>
				<CardBody>
					<Heading fontSize={'2xl'}>{t('contact_heading', { ns: 'global' })}</Heading>
					<Text fontSize={'lg'} mt={4}>
						{t('contact_text', { ns: 'global' })}
					</Text>
					<Stack spacing={4} mt={5}>
						<FormControl>
							<FormLabel>{t('contact_name', { ns: 'global' })}</FormLabel>
							<Input
								name="fullName"
								type="text"
								placeholder="Ismingizni kiriting"
								h={14}
								value={formData.fullName}
								onChange={handleChange}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>{t('contact_phone', { ns: 'global' })}</FormLabel>
							<Input
								name="phone"
								type="tel"
								placeholder="+998901234567"
								h={14}
								value={formData.phone}
								onChange={handleChange}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>{t('contact_message', { ns: 'global' })}</FormLabel>
							<Textarea
								name="message"
								placeholder="Xabaringizni kiriting"
								height="150px"
								value={formData.message}
								onChange={handleChange}
							/>
						</FormControl>
						<Button
							w={'full'}
							h={14}
							colorScheme={'gray'}
							onClick={handleSubmit}
							isLoading={isLoading}
							loadingText={t('sending', { ns: 'global' })}
						>
							{t('contact_btn', { ns: 'global' })}
						</Button>
					</Stack>
				</CardBody>
			</Card>
		</Flex>
	);
};

export default ContactPageComponent;
