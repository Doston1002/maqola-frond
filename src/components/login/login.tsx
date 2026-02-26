import {
	Box,
	Button,
	Heading,
	Icon,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Text,
	useColorModeValue,
	useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { AuthService } from 'src/services/auth.service';
import { LoginProps } from './login.props';

const Login = ({ onNavigateStateComponent }: LoginProps) => {
	const [show, setShow] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const { t } = useTranslation();
	const router = useRouter();
	const toast = useToast();

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		if (!email.trim() || !password) {
			setError('Email va parolni kiriting');
			return;
		}
		setLoading(true);
		try {
			await AuthService.loginAdmin(email.trim(), password);
			toast({
				title: t('successfully_logged', { ns: 'global' }) || 'Muvaffaqiyatli kirdingiz',
				status: 'success',
				isClosable: true,
				position: 'top-right',
			});
			router.push('/admin');
		} catch (err: any) {
			const msg = err?.response?.data?.message || err?.message || 'Email yoki parol noto\'g\'ri';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Stack spacing={6}>
			<Heading
				color={useColorModeValue('gray.900', 'gray.200')}
				lineHeight={1.1}
				fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
			>
				{t('login_title', { ns: 'global' }) || 'Admin kirish'}
				<Text as="span" bgGradient="linear(to-r, gray.400,facebook.400)" bgClip="text">
					!
				</Text>
			</Heading>
			<Text color="gray.500" fontSize={{ base: 'sm', sm: 'md' }}>
				{t('login_description', { ns: 'global' }) || 'Admin panelga kirish uchun email va parolni kiriting.'}
			</Text>

			{error && (
				<Box bg="red.50" color="red.700" px={4} py={2} borderRadius="md" fontSize="sm">
					{error}
				</Box>
			)}

			<Box as="form" onSubmit={onSubmit}>
				<Stack spacing={4}>
					<Box>
						<Text mb={2} fontSize="sm" fontWeight="medium">
							{t('login_input_email_label', { ns: 'global' }) || 'Email'}
						</Text>
						<Input
							type="email"
							placeholder="admin@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							autoComplete="email"
						/>
					</Box>
					<Box>
						<Text mb={2} fontSize="sm" fontWeight="medium">
							{t('login_input_password_label', { ns: 'global' }) || 'Parol'}
						</Text>
						<InputGroup>
							<Input
								type={show ? 'text' : 'password'}
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								autoComplete="current-password"
							/>
							<InputRightElement>
								<Box
									as="button"
									type="button"
									onClick={() => setShow((p) => !p)}
									cursor="pointer"
									aria-label={show ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
								>
									<Icon as={show ? AiOutlineEyeInvisible : AiOutlineEye} />
								</Box>
							</InputRightElement>
						</InputGroup>
					</Box>
					<Button
						w="full"
						colorScheme="blue"
						h={12}
						type="submit"
						isLoading={loading}
						loadingText={t('loading', { ns: 'global' }) || 'Kirilmoqda...'}
					>
						{t('login_btn', { ns: 'global' }) || 'Kirish'}
					</Button>
				</Stack>
			</Box>

		</Stack>
	);
};

export default Login;
