import {
	Avatar,
	AvatarBadge,
	Box,
	Button,
	Flex,
	HStack,
	IconButton,
	Text,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { Form, Formik, FormikValues } from 'formik';
import Cookies from 'js-cookie';
import { ChangeEvent, useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import TextAreaField from 'src/components/text-area-field/text-area-field';
import TextFiled from 'src/components/text-filed/text-filed';
import { loadImage } from 'src/helpers/image.helper';
import { useActions } from 'src/hooks/useActions';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { AuthService } from 'src/services/auth.service';
import { FileService } from 'src/services/file.service';
import { useTranslation } from 'react-i18next';

const Settings = () => {
	const [avatar, setavatar] = useState<File>();
	const [values, setValues] = useState(data);
	const [isLoading, setIsLoading] = useState(false);
	const { t } = useTranslation('dashboard');

	const { user } = useTypedSelector(state => state.user);
	const toast = useToast();
	const { checkAuth } = useActions();

	const onSubmit = async (formikValues: FormikValues) => {
		setIsLoading(true);
		let avatarUrl: string = user?.avatar as string;
		try {
			if (avatar) {
				const formData = new FormData();
				formData.append('image', avatar);
				const response = await FileService.fileUpload(
					formData,
					'avatar'
				);
				avatarUrl = response.url;
			}
			const data = {
				avatar: avatarUrl,
				...formikValues,
			};
			const response = await AuthService.updateUser(data);
			if (response) {
				const refreshToken = Cookies.get('refresh');
				if (refreshToken) checkAuth();
				setIsLoading(false);
				toast({
					title: 'Your profile updated successfully',
					status: 'success',
					position: 'top-right',
				});
			}
		} catch (error) {
			setIsLoading(false);
		}
	};

	const onFilehandler = (e: ChangeEvent) => {
		const target = e.target as HTMLInputElement;
		const file: File = (target.files as FileList)[0];

		if (file && file.size > 2081800) {
			toast({
				title: "Rasim hajmi juda katta, kamida 2mb bo'lishi kerak",
				status: 'error',
			});
			return;
		}

		if (file.type == 'image/jpeg' || file.type == 'image/png') {
			setavatar(file);
		} else {
			toast({
				title:
					"Xatolik, biz faqat PNG va JPG fayllarini qo'llab-quvvatlaymiz",
				status: 'error',
			});
		}
	};

	const openFile = () => {
		const doc = document.getElementById('file');
		return doc?.click();
	};

	useEffect(() => {
		if (user) {
			const { fullName, job, bio, birthday } = user;
			const full: string[] = fullName?.split(' ') || [];
			setValues({
				firstName: full[0] || '',
				lastName: full[1] || '',
				job: job as string,
				bio,
				birthday,
			});
		}
	}, []);

	return (
		<>
			<HStack>
				<Avatar
					src={
						avatar
							? URL.createObjectURL(avatar)
							: loadImage(user?.avatar)
					}
					name={user?.fullName}
					backgroundColor={'facebook.500'}
					size={'xl'}
				>
					{avatar ? (
						<AvatarBadge
							as={IconButton}
							size='sm'
							rounded='full'
							top='-10px'
							colorScheme='gray'
							aria-label='remove Image'
							icon={<AiOutlineClose />}
							onClick={() => setavatar(undefined)}
						/>
					) : (
						<label htmlFor=''>
							<AvatarBadge
								as={IconButton}
								size='sm'
								rounded='full'
								top='-10px'
								colorScheme='gray'
								aria-label='remove Image'
								icon={<MdEdit />}
								onClick={openFile}
							/>
							<input
								type='file'
								hidden
								accept='image/*'
								id='file'
								onChange={e => onFilehandler(e)}
							/>
						</label>
					)}
				</Avatar>
				<VStack align={'flex-start'}>
					<Text fontSize={'xl'} fontWeight={'bold'}>
						{user?.fullName}
					</Text>
					<Text>
						<Box fontWeight={'bold'} as={'span'}>
							{t('settings.email_label')}
						</Box>
						: {user?.email}
					</Text>
				</VStack>
			</HStack>
			<Formik
				onSubmit={onSubmit}
				initialValues={values}
				enableReinitialize
			>
				<Form>
					<Flex gap={5}>
						<TextFiled
							name='firstName'
							label={t('settings.first_name_label')}
							placeholder='Ism'
						/>
						<TextFiled
							name='lastName'
							label={t('settings.last_name_label')}
							placeholder='Sharfingiz'
						/>
					</Flex>
					<Flex gap={5}>
						<TextFiled
							name='birthday'
							label={t('settings.birthday_label')}
							placeholder='Tug`ilgan kun'
							type='date'
						/>
						<TextFiled
							name='job'
							label={t('settings.job_label')}
							placeholder='Kasbingiz'
						/>
					</Flex>
					<TextAreaField
						name='bio'
						placeholder="O'zingiz haqingizda"
						label={t('settings.bio_label') as string}
						height='100'
					/>
					<Button
						mt={5}
						h={14}
						w={'full'}
						colorScheme={'gray'}
						isActive
						type='submit'
						isLoading={isLoading}
					>
						{t('settings.submit_btn')}
					</Button>
				</Form>
			</Formik>
		</>
	);
};

export default Settings;

const data = {
	firstName: '',
	lastName: '',
	birthday: '',
	job: '',
	bio: '',
};
