import {
	Box,
	Button,
	Divider,
	Icon,
	InputRightElement,
	Text,
	useToast,
	VStack,
	HStack,
	Progress,
	Badge,
	Alert,
	AlertIcon,
	AlertDescription,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import TextFiled from 'src/components/text-filed/text-filed';
import { useActions } from 'src/hooks/useActions';
import { useShowPassword } from 'src/hooks/useShowPassword';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { AuthValidation } from 'src/validations/auth.validation';

const DangerZone = () => {
	const { editProfilePassword } = useActions();
	const { user } = useTypedSelector(state => state.user);
	const toast = useToast();
	const { t } = useTranslation();
	const { show, toggleShow, showConfirm, toggleShowConfirm } =
		useShowPassword();

	const [password, setPassword] = useState('');
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [passwordRequirements, setPasswordRequirements] = useState({
		length: false,
		uppercase: false,
		lowercase: false,
		number: false,
		special: false,
	});

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

	const onSubmit = (formData: { password: string }) => {
		if (passwordStrength < 5) {
			toast({
				title: t('password_requirements_not_met', { ns: 'global' }),
				description: t('password_complexity_requirements', { ns: 'global' }),
				status: 'error',
				position: 'top-right',
				isClosable: true,
			});
			return;
		}

		editProfilePassword({
			email: user?.email as string,
			password: formData.password,
			callback: () => {
				toast({
					title: `${t('successfully_edited', { ns: 'global' })}`,
					description: `${t('login_with_new_password', {
						ns: 'global',
					})}`,
					status: 'success',
					position: 'top-right',
					isClosable: true,
				});
			},
		});
	};

	return (
		<>
			<Text fontSize={'2xl'}>{t('change_password', { ns: 'global' })}</Text>
			<Divider my={5} />
			
			{/* Parol talablari haqida ma'lumot */}
			<Alert status="info" mb={5}>
				<AlertIcon />
				<AlertDescription>
					{t('password_requirements_info', { ns: 'global' })}
				</AlertDescription>
			</Alert>

			<Box maxW={'70%'}>
				<Formik
					onSubmit={onSubmit}
					initialValues={{ password: '', confirmPassword: '' }}
					validationSchema={AuthValidation.editPassword}
				>
					{({ values, setFieldValue }) => (
						<Form>
							<VStack spacing={4} align="stretch">
								<Box>
									<TextFiled
										name='password'
										label={t('account_recovery_title_form3', {
											ns: 'global',
										})}
										type={!show ? 'password' : 'text'}
										placeholder={'****'}
										onChange={(e) => {
											setFieldValue('password', e.target.value);
											setPassword(e.target.value);
										}}
									>
										<InputRightElement pt={4}>
											<Icon
												as={!show ? AiOutlineEye : AiOutlineEyeInvisible}
												cursor={'pointer'}
												onClick={toggleShow}
											/>
										</InputRightElement>
									</TextFiled>

									{/* Parol murakkabligi ko'rsatkichi */}
									{password && (
										<Box mt={3}>
											<HStack justify="space-between" mb={2}>
												<Text fontSize="sm" fontWeight="bold">
													{t('password_strength', { ns: 'global' })}:
												</Text>
												<Badge 
													colorScheme={
														passwordStrength < 3 ? 'red' : 
														passwordStrength < 5 ? 'yellow' : 'green'
													}
												>
													{passwordStrength < 3 ? t('weak', { ns: 'global' }) :
													 passwordStrength < 5 ? t('medium', { ns: 'global' }) :
													 t('strong', { ns: 'global' })}
												</Badge>
											</HStack>
											<Progress 
												value={passwordStrength * 20} 
												colorScheme={
													passwordStrength < 3 ? 'red' : 
													passwordStrength < 5 ? 'yellow' : 'green'
												}
												size="sm"
											/>
										</Box>
									)}

									{/* Parol talablari ro'yxati */}
									{password && (
										<Box mt={3}>
											<Text fontSize="sm" fontWeight="bold" mb={2}>
												{t('password_requirements', { ns: 'global' })}:
											</Text>
											<VStack align="start" spacing={1}>
												<HStack>
													<Icon 
														as={passwordRequirements.length ? AiOutlineCheck : AiOutlineClose} 
														color={passwordRequirements.length ? 'green.500' : 'red.500'}
													/>
													<Text fontSize="sm">
														{t('password_min_length', { ns: 'global' })}
													</Text>
												</HStack>
												<HStack>
													<Icon 
														as={passwordRequirements.uppercase ? AiOutlineCheck : AiOutlineClose} 
														color={passwordRequirements.uppercase ? 'green.500' : 'red.500'}
													/>
													<Text fontSize="sm">
														{t('password_uppercase', { ns: 'global' })}
													</Text>
												</HStack>
												<HStack>
													<Icon 
														as={passwordRequirements.lowercase ? AiOutlineCheck : AiOutlineClose} 
														color={passwordRequirements.lowercase ? 'green.500' : 'red.500'}
													/>
													<Text fontSize="sm">
														{t('password_lowercase', { ns: 'global' })}
													</Text>
												</HStack>
												<HStack>
													<Icon 
														as={passwordRequirements.number ? AiOutlineCheck : AiOutlineClose} 
														color={passwordRequirements.number ? 'green.500' : 'red.500'}
													/>
													<Text fontSize="sm">
														{t('password_number', { ns: 'global' })}
													</Text>
												</HStack>
												<HStack>
													<Icon 
														as={passwordRequirements.special ? AiOutlineCheck : AiOutlineClose} 
														color={passwordRequirements.special ? 'green.500' : 'red.500'}
													/>
													<Text fontSize="sm">
														{t('password_special_char', { ns: 'global' })}
													</Text>
												</HStack>
											</VStack>
										</Box>
									)}
								</Box>

								<TextFiled
									name='confirmPassword'
									label={t('register_input_confirm_password_label', {
										ns: 'global',
									})}
									type={!showConfirm ? 'password' : 'text'}
									placeholder={'****'}
								>
									<InputRightElement pt={4}>
										<Icon
											as={
												!showConfirm
													? AiOutlineEye
													: AiOutlineEyeInvisible
											}
											cursor={'pointer'}
											onClick={toggleShowConfirm}
										/>
									</InputRightElement>
								</TextFiled>

								<Button
									w={'full'}
									bgGradient='linear(to-r, facebook.400,gray.400)'
									color={'white'}
									_hover={{
										bgGradient: 'linear(to-r, facebook.500,gray.500)',
										boxShadow: 'xl',
									}}
									h={14}
									mt={4}
									type={'submit'}
									loadingText={`${t('loading', { ns: 'global' })}`}
									isDisabled={passwordStrength < 5}
								>
									{t('account_recovery_btn_form3', { ns: 'global' })}
								</Button>
							</VStack>
						</Form>
					)}
				</Formik>
			</Box>
		</>
	);
};

export default DangerZone;
