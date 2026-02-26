import { NextPage } from 'next';
import { withInstructorLayout } from 'src/layouts/instructor';
import { InstructorCreateCourseComponent } from 'src/page-component';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getRoleFromToken } from 'src/helpers/token.helper';
import { GetServerSideProps } from 'next';

const CreateCourses: NextPage = () => {
	const router = useRouter();
	
	// ✅ SECURITY FIX: Role ni token dan o'qish (har safar backend dan)
	const userRole = getRoleFromToken();

	useEffect(() => {
		if (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
			router.push('/');
		}
	}, [userRole, router]);

	if (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
		return null;
	}

	return <InstructorCreateCourseComponent />;
};

export default withInstructorLayout(CreateCourses);

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	try {
		const token = req.cookies.refresh;
		
		// Token yo'q bo'lsa auth sahifasiga yo'naltirish
		if (!token) {
			return {
				redirect: {
					destination: '/auth',
					permanent: false,
				},
			};
		}

		// Bu sahifa uchun alohida ma'lumot kerak emas, faqat himoya uchun
		return {
			props: {},
		};
	} catch (error) {
		console.error('Instructor access error:', error);
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
};
