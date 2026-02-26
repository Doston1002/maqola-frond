import {
	Box,
	Button,
	Card,
	CardBody,
	Heading,
	IconButton,
	Input,
	Select,
	Stack,
	Table,
	TableCaption,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useColorModeValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineFieldNumber, AiOutlinePlus, AiOutlineReload, AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai';
import { ErrorAlert, UserModal } from 'src/components';
import SectionTitle from 'src/components/section-title/section-title';
import { courseusers } from 'src/config/constants';
import { useActions } from 'src/hooks/useActions';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { AdminService } from 'src/services/admin.service';
import { RoleUser } from 'src/interfaces/constants.interface';
import { UserType } from 'src/interfaces/user.interface';

const UserPageComponent = () => {
	const [limit, setLimit] = useState<number>(15);
	const [query, setQuery] = useState<string>('');
	const [changingRole, setChangingRole] = useState<string | null>(null);
	const [blockingUser, setBlockingUser] = useState<string | null>(null);
	const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [chartData] = useState({
		labels: courseusers.map(data => data.year),
		datasets: [
			{
				label: 'Users Gained ',
				data: courseusers.map(data => data.userGain),
				backgroundColor: ['rgba(75,192,192,1)', '#50AF95', '#f3ba2f', '#2a71d0'],
				borderColor: 'black',
				borderWidth: 2,
			},
		],
	});
	const { users } = useTypedSelector(state => state.admin);
	const { t } = useTranslation();
	const { moreAdminUser, clearAdminError, searchAdminUsers } = useActions();
	const { isLoading, error } = useTypedSelector(state => state.admin);

	const moreAdminUserHandler = () => {
		setLimit(prev => prev + 5);
		const token = Cookies.get('refresh');
		moreAdminUser({ limit: String(limit), token });
	};

	const searchUserHandler = () => {
		searchAdminUsers({ query, limit: String(limit - 5) });
	};

	const changeRoleHandler = async (userId: string, newRole: RoleUser) => {
		try {
			setChangingRole(userId);
			await AdminService.changeUserRole(userId, newRole);
			toast({
				title: 'Role updated successfully',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
			// Refresh the users list
			refreshUsers();
		} catch (error) {
			toast({
				title: 'Failed to update role',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setChangingRole(null);
		}
	};

	const refreshUsers = () => {
		const token = Cookies.get('refresh');
		moreAdminUser({ limit: String(limit), token });
	};

	const handleAddUser = () => {
		setSelectedUser(null);
		onOpen();
	};

	const handleEditUser = (user: UserType) => {
		setSelectedUser(user);
		onOpen();
	};

	const handleDeleteUser = async (userId: string, userEmail: string) => {
		if (!window.confirm(`${t('confirm_delete_user', { ns: 'admin' })} "${userEmail}"?`)) {
			return;
		}

		try {
			await AdminService.deleteUser(userId);
			toast({
				title: t('user_deleted_successfully', { ns: 'admin' }),
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: 'top-right',
			});
			refreshUsers();
		} catch (error: any) {
			toast({
				title: error?.response?.data?.message || t('delete_failed', { ns: 'admin' }),
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleBlockUser = async (userId: string, userEmail: string) => {
		if (!window.confirm(`${t('confirm_block_user', { ns: 'admin' })} "${userEmail}"?`)) {
			return;
		}

		try {
			setBlockingUser(userId);
			await AdminService.blockUser(userId);
			toast({
				title: t('user_blocked_successfully', { ns: 'admin' }),
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: 'top-right',
			});
			refreshUsers();
		} catch (error: any) {
			toast({
				title: error?.response?.data?.message || t('block_failed', { ns: 'admin' }),
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setBlockingUser(null);
		}
	};

	const handleUnblockUser = async (userId: string, userEmail: string) => {
		if (!window.confirm(`${t('confirm_unblock_user', { ns: 'admin' })} "${userEmail}"?`)) {
			return;
		}

		try {
			setBlockingUser(userId);
			await AdminService.unblockUser(userId);
			toast({
				title: t('user_unblocked_successfully', { ns: 'admin' }),
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: 'top-right',
			});
			refreshUsers();
		} catch (error: any) {
			toast({
				title: error?.response?.data?.message || t('unblock_failed', { ns: 'admin' }),
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setBlockingUser(null);
		}
	};

	const handleModalClose = () => {
		setSelectedUser(null);
		onClose();
	};

	return (
		<>
			<Card>
				<CardBody>
					<Stack>
						<SectionTitle
							title={t('user_section_title', { ns: 'admin' })}
							subtitle={t('user_section_descr', { ns: 'admin' })}
						/>
						<Box className='chart-container'>
							<Line
								data={chartData}
								options={{
									plugins: {
										title: { display: false },
										legend: { display: false },
									},
								}}
							/>
						</Box>
					</Stack>
				</CardBody>
			</Card>
			<Box mt={10}>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
					<Heading>{t('all_users', { ns: 'instructor' })}</Heading>
					<Button
						leftIcon={<AiOutlinePlus />}
						colorScheme="blue"
						onClick={handleAddUser}
					>
						{t('add_user', { ns: 'admin' })}
					</Button>
				</Box>
			<Box pos={'relative'} mt={5}>
				<Input
					h={14}
					w={'full'}
					bg={useColorModeValue('white','gray.900')}
					color={useColorModeValue('gray.900', 'white')}
					placeholder={t('search_input_placeholder', { ns: 'courses' }) || ''}
					_placeholder={{ color: 'gray.500' }}
					value={query}
					onChange={e => setQuery(e.target.value)}
				/>
					<Button
						pos={'absolute'}
						right={2}
						top={2}
						colorScheme={'gray'}
						zIndex={999}
						onClick={searchUserHandler}
					>
						{t('search_input_btn', { ns: 'courses' })}
					</Button>
				</Box>
				<>{error && <ErrorAlert title={error as string} clearHandler={clearAdminError} />}</>
				<TableContainer mt={10}>
					<Table variant='striped' colorScheme='teal'>
						<TableCaption>
							<Button
								colorScheme={'gray'}
								variant={'outline'}
								rightIcon={<AiOutlineReload />}
								isLoading={isLoading}
								onClick={moreAdminUserHandler}
							>
								{t('more', { ns: 'instructor' })}...
							</Button>
						</TableCaption>
						<Thead>
							<Tr>
								<Th isNumeric>
									<AiOutlineFieldNumber fontSize={20} />
								</Th>
								<Th>{t('email', { ns: 'instructor' })}</Th>
								<Th>{t('full_name', { ns: 'instructor' })}</Th>
								<Th>{t('status', { ns: 'admin' })}</Th>
								<Th>{t('role', { ns: 'admin' })}</Th>
								<Th>{t('change_role', { ns: 'admin' })}</Th>
								<Th>{t('enrolled_date', { ns: 'instructor' })}</Th>
								<Th>{t('actions', { ns: 'admin' })}</Th>
							</Tr>
						</Thead>
						<Tbody>
							{users.map((user, idx) => (
								<Tr key={idx} opacity={user.isBlocked ? 0.6 : 1}>
									<Td>{idx + 1}</Td>
									<Td>{user.email}</Td>
									<Td>{user.fullName || t('not_found', { ns: 'admin' })}</Td>
									<Td>
										<Box
											px={2}
											py={1}
											bg={user.isBlocked ? 'red.200' : 'green.200'}
											color={user.isBlocked ? 'red.900' : 'green.900'}
											borderRadius="md"
											fontSize="sm"
											fontWeight="bold"
											textAlign="center"
										>
											{user.isBlocked ? t('blocked', { ns: 'admin' }) : t('active', { ns: 'admin' })}
										</Box>
									</Td>
									<Td>
										<Box
											px={2}
											py={1}
											bg={
												user.role === 'ADMIN'
													? 'red.100'
													: user.role === 'INSTRUCTOR'
													? 'blue.100'
													: 'green.100'
											}
											color={
												user.role === 'ADMIN'
													? 'red.800'
													: user.role === 'INSTRUCTOR'
													? 'blue.800'
													: 'green.800'
											}
											borderRadius="md"
											fontSize="sm"
											fontWeight="bold"
											textAlign="center"
										>
											{user.role || 'USER'}
										</Box>
									</Td>
									<Td>
										<Select
											value={user.role || 'USER'}
											onChange={(e) => changeRoleHandler(user.id, e.target.value as RoleUser)}
											disabled={changingRole === user.id}
											size="sm"
											variant="outline"
										>
											<option value="USER">USER</option>
											<option value="INSTRUCTOR">INSTRUCTOR</option>
											<option value="ADMIN">ADMIN</option>
										</Select>
									</Td>
									<Td>{format(new Date(user.createdAt as Date), 'dd MMMM, yyyy')}</Td>
									<Td>
										<Box display="flex" gap={2}>
											<IconButton
												aria-label="Edit user"
												icon={<AiOutlineEdit />}
												size="sm"
												colorScheme="blue"
												onClick={() => handleEditUser(user)}
											/>
											{user.isBlocked ? (
												<IconButton
													aria-label="Unblock user"
													icon={<AiOutlineUnlock />}
													size="sm"
													colorScheme="green"
													isLoading={blockingUser === user.id}
													onClick={() => handleUnblockUser(user.id, user.email || '')}
												/>
											) : (
												<IconButton
													aria-label="Block user"
													icon={<AiOutlineLock />}
													size="sm"
													colorScheme="orange"
													isLoading={blockingUser === user.id}
													onClick={() => handleBlockUser(user.id, user.email || '')}
												/>
											)}
											<IconButton
												aria-label="Delete user"
												icon={<AiOutlineDelete />}
												size="sm"
												colorScheme="red"
												onClick={() => handleDeleteUser(user.id, user.email || '')}
											/>
										</Box>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>

			{/* User Modal */}
			<UserModal
				isOpen={isOpen}
				onClose={handleModalClose}
				userValue={selectedUser}
				onSuccess={refreshUsers}
			/>
		</>
	);
};

export default UserPageComponent;
