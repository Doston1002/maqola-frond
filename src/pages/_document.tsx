import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="uz">
			<Head>
				<link rel="icon" href="/images/logoDark.png" />
				<link rel="apple-touch-icon" href="/images/logoDark.png" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

