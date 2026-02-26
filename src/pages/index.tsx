import { GetServerSideProps } from 'next';
import { withLayout } from 'src/layouts/layout';
import Seo from 'src/layouts/seo/seo';
import HomePageComponent, { getHomePageData } from 'src/page-component/home-page-component/home-page-component';

const Home = ({ collections, stats }: { collections: unknown[]; stats: { collectionsCount: number; articlesCount: number } }) => {
	return (
		<Seo
			metaTitle="Ilmiy maqolalar va journal"
			metaDescription="Ilmiy maqolalar to'plamlarini ko'ring, maqolalarni o'qing va PDF yuklab oling."
			children={<HomePageComponent collections={collections as any} stats={stats} />}
		/>
	);
};

export default withLayout(Home);

export const getServerSideProps: GetServerSideProps = async () => {
	const { collections, stats } = await getHomePageData();
	return { props: { collections, stats } };
};
