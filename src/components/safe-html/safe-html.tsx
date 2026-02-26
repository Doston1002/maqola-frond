'use client';

import { Box } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

interface SafeHtmlProps {
	html: string;
	as?: keyof JSX.IntrinsicElements;
	[key: string]: unknown;
}

/** Renders sanitized HTML. Uses client-only to avoid DOMPurify SSR issues. */
export const SafeHtml = ({ html, as = 'div', ...boxProps }: SafeHtmlProps) => {
	const [sanitized, setSanitized] = useState('');

	useEffect(() => {
		setSanitized(DOMPurify.sanitize(html || ''));
	}, [html]);

	if (!sanitized) return null;
	return <Box as={as} dangerouslySetInnerHTML={{ __html: sanitized }} {...boxProps} />;
};
