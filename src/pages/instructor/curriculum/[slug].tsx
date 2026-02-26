import { GetServerSideProps } from 'next';
import { CourseType } from 'src/interfaces/course.interface';
import { withInstructorLayout } from 'src/layouts/instructor';
import { CurriculumPageComponent } from 'src/page-component';
import { InstructorService } from 'src/services/instructor.service';

const CurriculumPage = () => {
	return <CurriculumPageComponent />;
};

export default withInstructorLayout(CurriculumPage);

export const getServerSideProps: GetServerSideProps<CoursesPageType> = async ({ req, query }) => {
	try {
		const course = await InstructorService.getDetailedCourse(
			req.cookies.refresh,
			query.slug as string,
		);

		// Kurs topilmasa 404 qaytaramiz
		if (!course) {
			return {
				notFound: true,
			};
		}

		return {
			props: { course },
		};
	} catch (error: any) {
		// Agar instructor avtorizatsiya qilinmagan bo'lsa, login sahifasiga yo'naltiramiz
		const status = error?.response?.status;

		if (status === 401 || status === 403) {
			return {
				redirect: {
					destination: '/auth',
					permanent: false,
				},
			};
		}

		// Boshqa xatolar uchun umumiy 404
		return {
			notFound: true,
		};
	}
};

interface CoursesPageType extends Record<string, unknown> {
	course: CourseType;
}
