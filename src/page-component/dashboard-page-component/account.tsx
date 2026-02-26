import {
	Box,
	chakra,
	Flex,
	SimpleGrid,
	Stat,
	StatLabel,
	StatNumber,
	useColorModeValue,
	Tooltip,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { MdAlternateEmail, MdUpdate } from 'react-icons/md';
import { SiAwesomelists } from 'react-icons/si';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { StatsCardProps } from './dashboard.props';
import { useTranslation } from 'react-i18next';

const Account = () => {
	const { user } = useTypedSelector((state) => state.user);
	const { t } = useTranslation('dashboard');

	return (
		<Box maxW='7xl' mx='auto' px={{ base: 2, sm: 12, md: 17 }}>
			<chakra.h1
				textAlign='center'
				fontSize='4xl'
				pb={6}
				fontWeight='bold'
			>
				{t('account.title')}
			</chakra.h1>

			<SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
				<StatsCard
					title={t('account.registered')}
					stat={user?.createdAt ? format(new Date(user.createdAt), 'dd MMMM, yyyy') : '-'}
					icon={<MdUpdate size='3em' />}
				/>

				<StatsCard
					title={t('account.email_label')}
					stat={user?.email || '-'}
					icon={<MdAlternateEmail size='3em' />}
				/>

				<StatsCard
					title={t('account.courses')}
					stat={`${user?.courses?.length || 0} ${t('account.courses_count_suffix')}`}
					icon={<SiAwesomelists size='3em' />}
				/>
			</SimpleGrid>
		</Box>
	);
};

export default Account;

function StatsCard(props: StatsCardProps) {
	const { title, stat, icon } = props;

	return (
		<Stat
			px={2}
			py='5'
			shadow='xl'
			border='1px solid'
			borderColor={useColorModeValue('gray.800', 'gray.500')}
			rounded='lg'
			overflow='hidden'
		>
			<Flex justifyContent='space-between' alignItems='center'>
				<Box maxW='80%' overflow='hidden'>
					<StatLabel fontWeight='medium' isTruncated>
						{title}
					</StatLabel>

					<Tooltip label={stat} hasArrow bg='gray.700' color='white'>
						<StatNumber
							fontSize='lg'
							fontWeight='bold'
							isTruncated
							whiteSpace='nowrap'
							overflow='hidden'
							textOverflow='ellipsis'
							display='block'
							maxW='100%'
						>
							{stat}
						</StatNumber>
					</Tooltip>
				</Box>

				<Box
					my='auto'
					color={useColorModeValue('gray.800', 'gray.200')}
					alignContent='center'
					flexShrink={0}
				>
					{icon}
				</Box>
			</Flex>
		</Stat>
	);
}
