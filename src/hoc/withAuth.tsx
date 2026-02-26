import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { NextPage } from 'next';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

export function withAuth<T extends object>(Component: NextPage<T>) {
	return function AuthenticatedComponent(props: T) {
		const router = useRouter();
		const { user, isLoading } = useTypedSelector(state => state.user);

		useEffect(() => {
			if (!isLoading && !user) {
				router.push('/');
			}
		}, [user, isLoading, router]);

		if (isLoading) {
			return (
				<Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
					<VStack spacing={4}>
						<Spinner size="xl" color="blue.500" />
						<Text>Yuklanmoqda...</Text>
					</VStack>
				</Box>
			);
		}

		if (!user) {
			return null;
		}

		return <Component {...props} />;
	};
}
