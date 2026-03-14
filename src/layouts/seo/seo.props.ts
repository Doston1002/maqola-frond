import { ReactNode } from 'react';

export interface SeoProps {
	children: ReactNode;
	metaTitle?: string;
	metaDescription?: string;
	metaKeyword?: string;
	/** OG/Twitter image — to'liq URL */
	ogImage?: string;
	canonicalUrl?: string;
	noIndex?: boolean;
	/** og:type — default "website", maqola sahifalarda "article" */
	ogType?: 'website' | 'article';
	/** Meta description maksimal belgi (default 160) */
	metaDescriptionMaxLength?: number;
}
