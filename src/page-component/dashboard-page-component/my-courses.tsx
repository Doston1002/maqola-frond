import { FC } from 'react';
import { AllCoursesCard } from 'src/components';
import { MyCoursesProps } from './dashboard.props';

const MyCourses: FC<MyCoursesProps> = ({
	myCourses,
}): JSX.Element => {
	return (
		<>
			{myCourses && myCourses.length > 0 ? (
				myCourses.map((course, index) => (
					<AllCoursesCard key={course._id || index} course={course} isMyCourse={true} />
				))
			) : (
				<div>Kurslar topilmadi</div>
			)}
		</>
	);
};

export default MyCourses;
