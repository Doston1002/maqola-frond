import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

interface ProtectedRouteProps {
	children: ReactNode;
	redirectTo?: string;
}

const ProtectedRoute = ({ children, redirectTo = '/' }: ProtectedRouteProps) => {
	const router = useRouter();
	const { user, isLoading } = useTypedSelector(state => state.user);

	useEffect(() => {
		// Agar foydalanuvchi ma'lumotlari yuklangan bo'lsa va foydalanuvchi yo'q bo'lsa
		if (!isLoading && !user) {
			router.push(redirectTo);
		}
	}, [user, isLoading, router, redirectTo]);

	// Loading holatida spinner ko'rsatish
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

	// Agar foydalanuvchi yo'q bo'lsa, hech narsa ko'rsatmaslik
	if (!user) {
		return null;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
