import { Html, Head, Main, NextScript } from 'next/document';

const siteName = 'Global Journal of Teaching and Science';
const baseURL = 'https://teaching-science.org';

export default function Document() {
	const organizationSchema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: siteName,
		url: baseURL,
		logo: `${baseURL}/images/logo.png`,
		sameAs: [],
	};

	return (
		<Html lang="uz">
			<Head>
				<link rel="icon" href="/images/logoDark.png" />
				<link rel="apple-touch-icon" href="/images/logoDark.png" />
				<link rel="alternate" type="application/rss+xml" title={`${siteName} — RSS`} href={`${baseURL}/feed.xml`} />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

