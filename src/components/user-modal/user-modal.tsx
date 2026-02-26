import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	useToast,
	VStack,
	Box,
	Text,
	HStack,
	Icon,
	Progress,
	Alert,
	AlertIcon,
	AlertDescription,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/react';
import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminService } from 'src/services/admin.service';
import { UserType } from 'src/interfaces/user.interface';
import ErrorAlert from '../error-alert/error-alert';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

interface UserModalProps {
	isOpen: boolean;
	onClose: () => void;
	userValue?: UserType | null;
	onSuccess: () => void;
}

const UserModal: FC<UserModalProps> = ({ isOpen, onClose, userValue, onSuccess }): JSX.Element => {
	const [email, setEmail] = useState('');
	const [fullName, setFullName] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'ADMIN' | 'INSTRUCTOR' | 'USER'>('USER');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [passwordRequirements, setPasswordRequirements] = useState({
		length: false,
		uppercase: false,
		lowercase: false,
		number: false,
		special: false,
	});

	const toast = useToast();
	const { t } = useTranslation();

	// Parol murakkabligini tekshirish
	const checkPasswordStrength = (pwd: string) => {
		const requirements = {
			length: pwd.length >= 8,
			uppercase: /[A-Z]/.test(pwd),
			lowercase: /[a-z]/.test(pwd),
			number: /\d/.test(pwd),
			special: /[@$!%*?&]/.test(pwd),
		};

		const strength = Object.values(requirements).filter(Boolean).length;
		setPasswordRequirements(requirements);
		setPasswordStrength(strength);
	};

	useEffect(() => {
		checkPasswordStrength(password);
	}, [password]);

	useEffect(() => {
		if (userValue) {
			setEmail(userValue.email || '');
			setFullName(userValue.fullName || '');
			setRole(userValue.role || 'USER');
			setPassword('');
		} else {
			setEmail('');
			setFullName('');
			setPassword('');
			setRole('USER');
		}
		setError('');
		setPasswordStrength(0);
		setPasswordRequirements({
			length: false,
			uppercase: false,
			lowercase: false,
			number: false,
			special: false,
		});
	}, [userValue, isOpen]);

	const handleSubmit = async () => {
		setError('');
		
		if (!email || !fullName) {
			setError(t('please_fill_all_fields', { ns: 'admin' }) as string);
			return;
		}

		// Email formatini tekshirish
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError(t('email_is_invalid', { ns: 'global' }) as string);
			return;
		}

		if (!userValue && !password) {
			setError(t('password_is_required', { ns: 'global' }) as string);
			return;
		}

		// Parol kiritilgan bo'lsa, murakkabligini tekshirish
		if (password) {
			if (password.length < 8) {
				setError(t('password_min_length', { ns: 'global' }) as string);
				return;
			}
			if (!/[A-Z]/.test(password)) {
				setError(t('password_uppercase', { ns: 'global' }) as string);
				return;
			}
			if (!/[a-z]/.test(password)) {
				setError(t('password_lowercase', { ns: 'global' }) as string);
				return;
			}
			if (!/\d/.test(password)) {
				setError(t('password_number', { ns: 'global' }) as string);
				return;
			}
							if (!/[@$!%*?&]/.test(password)) {
								setError(t('password_special_char', { ns: 'global' }) as string);
								return;
							}
		}

		try {
			setIsLoading(true);
			
			if (userValue) {
				// Update existing user
				await AdminService.updateUser(
					userValue.id,
					email,
					fullName,
					password || undefined,
					role
				);
				
				toast({
					title: t('successfully_edited', { ns: 'global' }),
					status: 'success',
					duration: 3000,
					isClosable: true,
					position: 'top-right',
				});
			} else {
				// Create new user
				await AdminService.createUser(email, fullName, password, role);
				
				toast({
					title: t('successfully_created_user', { ns: 'admin' }),
					status: 'success',
					duration: 3000,
					isClosable: true,
					position: 'top-right',
				});
			}
			
			onSuccess();
			onClose();
		} catch (err: any) {
			console.log('Error details:', err);
			console.log('Error response:', err?.response);
			console.log('Error response data:', err?.response?.data);
			
			const errorMessage = err?.response?.data?.message || err?.message || '';
			
			// Email mavjud bo'lsa maxsus xabar
			if (errorMessage.toLowerCase().includes('already exists') || 
			    errorMessage.toLowerCase().includes('email already')) {
				setError(t('email_already_exists', { ns: 'admin' }) as string);
			} else {
				setError(errorMessage || t('error_occurred', { ns: 'global' }));
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					{userValue ? t('edit_user', { ns: 'admin' }) : t('add_user', { ns: 'admin' })}
				</ModalHeader>
				<ModalCloseButton />
				
				<ModalBody>
					{error && <ErrorAlert title={error} clearHandler={() => setError('')} />}
					
					<VStack spacing={4}>
						<FormControl isRequired>
							<FormLabel>{t('email', { ns: 'instructor' })}</FormLabel>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="example@mail.com"
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel>{t('full_name', { ns: 'instructor' })}</FormLabel>
							<Input
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								placeholder={t('full_name', { ns: 'instructor' }) || ''}
							/>
						</FormControl>

					<FormControl isRequired={!userValue}>
						<FormLabel>
							{t('password', { ns: 'global' })}
							{userValue && ` (${t('leave_empty_to_keep', { ns: 'admin' })})`}
						</FormLabel>
						<InputGroup>
							<Input
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder={userValue ? '********' : ''}
							/>
							<InputRightElement>
								<Icon
									as={showPassword ? AiOutlineEyeInvisible : AiOutlineEye}
									cursor="pointer"
									onClick={() => setShowPassword(!showPassword)}
								/>
							</InputRightElement>
						</InputGroup>

						{/* Parol kuchi indikatori */}
						{password && (
							<Box mt={2}>
								<Progress
									value={(passwordStrength / 5) * 100}
									size="sm"
									colorScheme={
										passwordStrength <= 2
											? 'red'
											: passwordStrength <= 4
											? 'yellow'
											: 'green'
									}
									borderRadius="md"
								/>
								<Text fontSize="xs" mt={1}>
									{t('password_strength', { ns: 'global' })}: {' '}
									{passwordStrength <= 2
										? t('weak', { ns: 'global' })
										: passwordStrength <= 4
										? t('medium', { ns: 'global' })
										: t('strong', { ns: 'global' })}
								</Text>
							</Box>
						)}

						{/* Parol talablari */}
						{password && (
							<Box mt={3} p={3} borderWidth="1px" borderRadius="md">
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									{t('password_requirements', { ns: 'global' })}:
								</Text>
								<VStack align="start" spacing={1}>
									<HStack>
										<Icon
											as={passwordRequirements.length ? AiOutlineCheck : AiOutlineClose}
											color={passwordRequirements.length ? 'green.500' : 'red.500'}
										/>
										<Text fontSize="xs">
											{t('password_min_length', { ns: 'global' })}
										</Text>
									</HStack>
									<HStack>
										<Icon
											as={passwordRequirements.uppercase ? AiOutlineCheck : AiOutlineClose}
											color={passwordRequirements.uppercase ? 'green.500' : 'red.500'}
										/>
										<Text fontSize="xs">
											{t('password_uppercase', { ns: 'global' })}
										</Text>
									</HStack>
									<HStack>
										<Icon
											as={passwordRequirements.lowercase ? AiOutlineCheck : AiOutlineClose}
											color={passwordRequirements.lowercase ? 'green.500' : 'red.500'}
										/>
										<Text fontSize="xs">
											{t('password_lowercase', { ns: 'global' })}
										</Text>
									</HStack>
									<HStack>
										<Icon
											as={passwordRequirements.number ? AiOutlineCheck : AiOutlineClose}
											color={passwordRequirements.number ? 'green.500' : 'red.500'}
										/>
										<Text fontSize="xs">
											{t('password_number', { ns: 'global' })}
										</Text>
									</HStack>
									<HStack>
										<Icon
											as={passwordRequirements.special ? AiOutlineCheck : AiOutlineClose}
											color={passwordRequirements.special ? 'green.500' : 'red.500'}
										/>
										<Text fontSize="xs">
											{t('password_special_char', { ns: 'global' })}
										</Text>
									</HStack>
								</VStack>
							</Box>
						)}
					</FormControl>

						<FormControl isRequired>
							<FormLabel>{t('role', { ns: 'admin' })}</FormLabel>
							<Select value={role} onChange={(e) => setRole(e.target.value as any)}>
								<option value="USER">USER</option>
								<option value="INSTRUCTOR">INSTRUCTOR</option>
								<option value="ADMIN">ADMIN</option>
							</Select>
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button variant="ghost" mr={3} onClick={onClose}>
						{t('cancel', { ns: 'admin' })}
					</Button>
					<Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
						{userValue ? t('save_changes', { ns: 'admin' }) : t('add_user', { ns: 'admin' })}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default UserModal;

