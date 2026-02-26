import {
	Avatar,
	Badge,
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import {
	AiOutlineDashboard,
	AiOutlineLogin,
} from 'react-icons/ai';
import { BiMenuAltLeft, BiUserCircle } from 'react-icons/bi';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';
import { IoIosLogOut } from 'react-icons/io';
import { RiAdminFill } from 'react-icons/ri';
import { TbWorld } from 'react-icons/tb';
import { language } from 'src/config/constants';
import { loadImage } from 'src/helpers/image.helper';
import { getRoleFromToken } from 'src/helpers/token.helper';
import { useActions } from 'src/hooks/useActions';
import { useAuth } from 'src/hooks/useAuth';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { HeaderProps } from './header.props';

const Header = ({ onToggle }: HeaderProps) => {
	const { toggleColorMode, colorMode } = useColorMode();
	const { i18n, t } = useTranslation();
	const router = useRouter();
	const { user } = useAuth();
	const { logout } = useActions();
	const { courses, books } = useTypedSelector(state => state.cart);
	
	// ✅ SECURITY FIX: Role ni token dan o'qish (har safar backend dan)
	const userRole = getRoleFromToken();

	const onLanguage = (lng: string) => {
		router.replace(router.asPath);
		i18n.changeLanguage(lng);
	};

	const logoutHandler = () => {
		logout();
		router.push('/auth');
	};

	return (
		<Box
			zIndex={1001}
			w={'full'}
			h={'10vh'}
			px={10}
			borderBottom={'1px'}
			pos={'fixed'}
			top={0}
			left={0}
			right={0}
			bg={useColorModeValue('gray.50', 'gray.900')}
			color={useColorModeValue('gray.700', 'gray.200')}
			borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
		>
		
			<Flex h={'full'} justify={'space-between'} align={'center'}>
				<HStack>
					<Icon
						as={BiMenuAltLeft}
						onClick={onToggle}
						w={6}
						h={6}
						cursor={'pointer'}
					/>
					<Link href={'/'}>
						{colorMode === 'light' ? (
							<img src="/images/logoDark.png" alt="Logo" width={120} height={80} style={{ display: 'block' }} />
						) : (
							<img src="/images/logoWhite.png" alt="Logo" width={120} height={80} style={{ display: 'block' }} />
						)}
					</Link>
				</HStack>
				<HStack>
					<Box pos={'relative'}>
						{/* <Button onClick={() => navigate(`/courses/${course.id}`)}>Detail</Button> */}
						{[...courses, ...books].length ? (
							<Badge
								pos={'absolute'}
								backgroundColor={'green.500'}
								top={-2}
								left={-3}
								colorScheme={'green'}
								px={2}
								py={1}
							>
								{[...courses, ...books].length}
							</Badge>
						) : null}
					</Box>
					<Menu placement='bottom'>
						<MenuButton
							as={Button}
							rightIcon={<TbWorld />}
							textTransform={'capitalize'}
							colorScheme={'gray'}
							variant={'outline'}
							display={{ base: 'none', md: 'block' }}
						>
							{i18n.resolvedLanguage}
						</MenuButton>
						<MenuList p={0}>
							{language.map(item => (
								<MenuItem
									key={item.lng}
									onClick={() => onLanguage(item.lng)}
									icon={<item.icon />}
									backgroundColor={
										i18n.resolvedLanguage === item.lng
											? 'facebook.500'
											: ''
									}
								>
									{item.nativeLng}
								</MenuItem>
							))}
						</MenuList>
					</Menu>
					<IconButton
						aria-label='color-mode'
						onClick={toggleColorMode}
						icon={
							colorMode == 'light' ? (
								<BsFillMoonFill />
							) : (
								<BsFillSunFill />
							)
						}
						colorScheme={'gray'}
						variant={'outline'}
					/>
					{user ? (
						<Menu>
							<MenuButton
								as={Button}
								rounded={'full'}
								variant={'link'}
								cursor={'pointer'}
								minW={0}
							>
								<Avatar
									backgroundColor={'facebook.500'}
									src={loadImage(user.avatar)}
								/>
							</MenuButton>
							<MenuList p={0} m={0}>
								{userRole === 'INSTRUCTOR' && (
									<MenuItem
										h={14}
										onClick={() => router.push('/instructor')}
										fontWeight={'bold'}
										icon={<RiAdminFill fontSize={17} />}
									>
										{t('instructor_admin', { ns: 'instructor' })}
									</MenuItem>
								)}
								   {userRole === 'ADMIN' && (
                                    <MenuItem
                                        h={14}
                                        onClick={() => router.push('/admin')}
                                        fontWeight={'bold'}
                                        icon={<RiAdminFill fontSize={17} />}
                                    >
                                        {t('instructor_admin', { ns: 'admin' })}
                                    </MenuItem>
								)}
								<MenuItem
									h={14}
									onClick={() => router.push('/dashboard')}
									fontWeight={'bold'}
									icon={<AiOutlineDashboard fontSize={17} />}
								>
									 {t('instructor_admin', { ns: 'admin' })}
								</MenuItem>

								<MenuItem
									h={14}
									onClick={logoutHandler}
									fontWeight={'bold'}
									icon={<IoIosLogOut fontSize={17} />}
								>
									{t('logout', { ns: 'global' })}
								</MenuItem>
							</MenuList>
						</Menu>
					) : (
						<>
							<Button
								display={{ base: 'none', md: 'flex' }}
								rightIcon={<BiUserCircle />}
								onClick={() => router.push('/auth')}
								colorScheme={'gray'}
							>
								{t('login', { ns: 'layout' })}
							</Button>
							<IconButton
								display={{ base: 'flex', md: 'none' }}
								aria-label='login'
								onClick={() => router.push('/auth')}
								icon={<AiOutlineLogin />}
								colorScheme={'gray'}
								variant={'outline'}
							/>
						</>
					)}
				</HStack>
			</Flex>
			<Box w="full" overflow="hidden" bg="transparent" h="30px" pos="relative" zIndex={-1}>
				<Box
					className="moving-red-text"
					fontWeight="bold"
					color="red.500"
					fontSize="lg"
					whiteSpace="nowrap"
				>
					{t('site_test_mode', { ns: 'home' })}
				</Box>
			</Box>
		</Box>
	);
};

export default Header;


// // --------------------------------------------------------------
// import {
// 	Avatar,
// 	Badge,
// 	Box,
// 	Button,
// 	Flex,
// 	HStack,
// 	Icon,
// 	IconButton,
// 	Menu,
// 	MenuButton,
// 	MenuItem,
// 	MenuList,
// 	useColorMode,
// 	useColorModeValue,
// } from '@chakra-ui/react';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useTranslation } from 'react-i18next';
// import {
// 	AiOutlineDashboard,
// 	AiOutlineLogin,
// } from 'react-icons/ai';
// import { BiMenuAltLeft, BiUserCircle } from 'react-icons/bi';
// import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';
// import { IoIosLogOut } from 'react-icons/io';
// import { RiAdminFill } from 'react-icons/ri';
// import { TbWorld } from 'react-icons/tb';
// import { loadImage } from 'src/helpers/image.helper';
// import { useActions } from 'src/hooks/useActions';
// import { useAuth } from 'src/hooks/useAuth';
// import { useTypedSelector } from 'src/hooks/useTypedSelector';
// import { HeaderProps } from './header.props';
// import Image from 'next/image';

// const Header = ({ onToggle }: HeaderProps) => {
// 	const { toggleColorMode, colorMode } = useColorMode();
// 	const { t } = useTranslation();
// 	const router = useRouter();
// 	const { user } = useAuth();
// 	const { logout } = useActions();
// 	const { courses, books } = useTypedSelector(state => state.cart);

// 	const logoutHandler = () => {
// 		logout();
// 		router.push('/auth');
// 	};

// 	return (
// 		<Box
// 			zIndex={1001}
// 			w={'full'}
// 			h={'10vh'}
// 			px={10}
// 			borderBottom={'1px'}
// 			pos={'fixed'}
// 			top={0}
// 			left={0}
// 			right={0}
// 			bg={useColorModeValue('gray.50', 'gray.900')}
// 			color={useColorModeValue('gray.700', 'gray.200')}
// 			borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
// 		>
		
// 			<Flex h={'full'} justify={'space-between'} align={'center'}>
// 				<HStack>
// 					<Icon
// 						as={BiMenuAltLeft}
// 						onClick={onToggle}
// 						w={6}
// 						h={6}
// 						cursor={'pointer'}
// 					/>
// 					<Link href={'/'}>
// 						{colorMode === 'light' ?  (
//         <Image
//           src="/images/logoDark.png"
//           alt={ 'Logo'}
//           width={120}
//           height={80}
//         />
//       ) : (
//         <Image
//           src="/images/logoWhite.png"
//           alt={'Logo'}
//           width={120}
//           height={80}
//         />
//       )}
// 					</Link>
// 				</HStack>
// 				<HStack>
// 					<Box pos={'relative'}>
// 						{/* <Button onClick={() => navigate(`/courses/${course.id}`)}>Detail</Button> */}
// 						{[...courses, ...books].length ? (
// 							<Badge
// 								pos={'absolute'}
// 								backgroundColor={'green.500'}
// 								top={-2}
// 								left={-3}
// 								colorScheme={'green'}
// 								px={2}
// 								py={1}
// 							>
// 								{[...courses, ...books].length}
// 							</Badge>
// 						) : null}
// 					</Box>
// 					<Button
// 						rightIcon={<TbWorld />}
// 						textTransform={'capitalize'}
// 						colorScheme={'gray'}
// 						variant={'outline'}
// 						display={{ base: 'none', md: 'block' }}
// 						cursor={'default'}
// 						_hover={{}}
// 						_active={{}}
// 					>
// 						uz
// 					</Button>
// 					<IconButton
// 						aria-label='color-mode'
// 						onClick={toggleColorMode}
// 						icon={
// 							colorMode == 'light' ? (
// 								<BsFillMoonFill />
// 							) : (
// 								<BsFillSunFill />
// 							)
// 						}
// 						colorScheme={'gray'}
// 						variant={'outline'}
// 					/>
// 					{user ? (
// 						<Menu>
// 							<MenuButton
// 								as={Button}
// 								rounded={'full'}
// 								variant={'link'}
// 								cursor={'pointer'}
// 								minW={0}
// 							>
// 								<Avatar
// 									backgroundColor={'facebook.500'}
// 									src={loadImage(user.avatar)}
// 								/>
// 							</MenuButton>
// 							<MenuList p={0} m={0}>
// 								{user.role === 'INSTRUCTOR' && (
// 									<MenuItem
// 										h={14}
// 										onClick={() => router.push('/instructor')}
// 										fontWeight={'bold'}
// 										icon={<RiAdminFill fontSize={17} />}
// 									>
// 										{t('instructor_admin', { ns: 'instructor' })}
// 									</MenuItem>
// 								)}
// 								   {user.role === 'ADMIN' && (
//                                     <MenuItem
//                                         h={14}
//                                         onClick={() => router.push('/admin/users')}
//                                         fontWeight={'bold'}
//                                         icon={<RiAdminFill fontSize={17} />}
//                                     >
//                                         {t('instructor_admin', { ns: 'admin' })}
//                                     </MenuItem>
//                                 )}
// 								<MenuItem
// 									h={14}
// 									onClick={() => router.push('/dashboard')}
// 									fontWeight={'bold'}
// 									icon={<AiOutlineDashboard fontSize={17} />}
// 								>
// 									 {t('instructor_admin', { ns: 'admin' })}
// 								</MenuItem>

// 								<MenuItem
// 									h={14}
// 									onClick={logoutHandler}
// 									fontWeight={'bold'}
// 									icon={<IoIosLogOut fontSize={17} />}
// 								>
// 									{t('logout', { ns: 'global' })}
// 								</MenuItem>
// 							</MenuList>
// 						</Menu>
// 					) : (
// 						<>
// 							<Button
// 								display={{ base: 'none', md: 'flex' }}
// 								rightIcon={<BiUserCircle />}
// 								onClick={() => router.push('/auth')}
// 								colorScheme={'gray'}
// 							>
// 								{t('login', { ns: 'layout' })}
// 							</Button>
// 							<IconButton
// 								display={{ base: 'flex', md: 'none' }}
// 								aria-label='login'
// 								onClick={() => router.push('/auth')}
// 								icon={<AiOutlineLogin />}
// 								colorScheme={'gray'}
// 								variant={'outline'}
// 							/>
// 						</>
// 					)}
// 				</HStack>
// 			</Flex>
// 			<Box w="full" overflow="hidden" bg="transparent" h="30px" pos="relative" zIndex={-1}>
// 				<Box
// 					className="moving-red-text"
// 					fontWeight="bold"
// 					color="red.500"
// 					fontSize="lg"
// 					whiteSpace="nowrap"
// 				>
// 					{t('site_test_mode', { ns: 'home' })}
// 				</Box>
// 			</Box>
// 		</Box>
// 	);
// };

// export default Header;
