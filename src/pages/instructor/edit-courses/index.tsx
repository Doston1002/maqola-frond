import { GetServerSideProps, NextPage } from 'next';
import { CourseType } from 'src/interfaces/course.interface';
import { withInstructorLayout } from 'src/layouts/instructor';
import { EditCoursePageComponent } from 'src/page-component';
import { InstructorService } from 'src/services/instructor.service';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getRoleFromToken } from 'src/helpers/token.helper';

const EditCourses: NextPage = () => {
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

	return <EditCoursePageComponent />;
};

export default withInstructorLayout(EditCourses);

export const getServerSideProps: GetServerSideProps<CoursesPageType> = async ({ req }) => {
	try {
		const token = req.cookies.refresh;
		
		if (!token) {
			return {
				redirect: {
					destination: '/auth',
					permanent: false,
				},
			};
		}

		const courses = await InstructorService.getAllCourses(token);

		return {
			props: { courses },
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

interface CoursesPageType extends Record<string, unknown> {
	courses: CourseType[];
}
