import Head from 'next/head';
import { siteConfig } from 'src/config/site.config';
import { SeoProps } from './seo.props';

const Seo = (props: SeoProps) => {
	const {
		children,
		metaTitle = siteConfig.metaData.title,
		metaDescription = siteConfig.metaData.description,
		metaKeyword = siteConfig.metaData.keyword,
		ogImage = siteConfig.metaData.ogImage,
		canonicalUrl,
		noIndex,
		ogType = 'website',
		metaDescriptionMaxLength = 160,
	} = props;

	const desc = metaDescription && metaDescription.length > metaDescriptionMaxLength
		? metaDescription.slice(0, metaDescriptionMaxLength - 3) + '...'
		: metaDescription;
	const ogUrl = canonicalUrl || siteConfig.baseURL;
	const imageUrl = ogImage?.startsWith('http') ? ogImage : (ogImage ? `${siteConfig.baseURL}${ogImage.startsWith('/') ? '' : '/'}${ogImage}` : siteConfig.metaData.ogImage);

	return (
		<>
			<Head>
				<meta charSet='utf-8' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, maximum-scale=5'
				/>
				<title>{metaTitle}</title>

				<meta httpEquiv='X-UA-Compatible' content='ie=edge' />
				<meta name='keyword' content={metaKeyword} />
				<meta name='author' content={siteConfig.metaData.author} />
				<meta name='description' content={desc || metaDescription} />
				{siteConfig.googleSiteVerification && (
					<meta name="google-site-verification" content={siteConfig.googleSiteVerification} />
				)}

				{/* Robots */}
				<meta
					name='robots'
					content={noIndex ? 'noindex,nofollow' : 'index,follow'}
				/>

				{/* Canonical URL */}
				<link
					rel='canonical'
					href={canonicalUrl || siteConfig.baseURL}
				/>

				<meta property='og:type' content={ogType} />
				<meta property='og:url' content={ogUrl} />
				<meta property='og:site_name' content={siteConfig.siteName} />
				<meta property='og:title' content={metaTitle} />
				<meta property='og:description' content={desc || metaDescription} />
				<meta property='og:image' content={imageUrl} />
				<meta property='og:image:height' content='630' />
				<meta property='og:image:width' content='1200' />
				<meta property='og:locale' content='uz_UZ' />

				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:title' content={metaTitle} />
				<meta name='twitter:description' content={desc || metaDescription} />
				<meta name='twitter:image' content={imageUrl} />
				<link
					rel='shortcut icon'
					href={siteConfig.favicon}
					type='image/x-icon'
				/>
			</Head>
			<>{children}</>
		</>
	);
};

export default Seo;
