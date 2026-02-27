import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { withLayout } from 'src/layouts/layout';
import Seo from 'src/layouts/seo/seo';
import { siteConfig } from 'src/config/site.config';
import HomePageComponent, { getHomePageData } from 'src/page-component/home-page-component/home-page-component';

const Home = ({ collections, stats }: { collections: unknown[]; stats: { collectionsCount: number; articlesCount: number } }) => {
	const url = `${siteConfig.baseURL}/`;

	return (
		<Seo
			metaTitle="Ilmiy maqolalar va journal"
			metaDescription="Ilmiy maqolalar to'plamlarini ko'ring, maqolalarni o'qing va PDF yuklab oling."
			canonicalUrl={url}
			children={
				<>
					<Head>
						<script
							type="application/ld+json"
							dangerouslySetInnerHTML={{
								__html: JSON.stringify({
									'@context': 'https://schema.org',
									'@type': 'WebSite',
									name: 'Teaching Science',
									url,
									potentialAction: {
										'@type': 'SearchAction',
										target: `${siteConfig.baseURL}/collections?q={search_term_string}`,
										'query-input': 'required name=search_term_string',
									},
								}),
							}}
						/>
					</Head>
					<HomePageComponent collections={collections as any} stats={stats} />
				</>
			}
		/>
	);
};

export default withLayout(Home);

export const getServerSideProps: GetServerSideProps = async () => {
	const { collections, stats } = await getHomePageData();
	return { props: { collections, stats } };
};
