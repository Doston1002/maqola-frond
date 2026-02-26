import { NextPage } from 'next';
import { withLayout } from 'src/layouts/layout';
import { UserDashboardPageComponent } from 'src/page-component';
import { withAuth } from 'src/hoc/withAuth';

const Dashboard: NextPage = () => {
	return <UserDashboardPageComponent />;
};

export default withLayout(withAuth(Dashboard));