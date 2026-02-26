import { ReactNode } from 'react';

export interface LayoutProps {
	children: ReactNode;
}

export interface AppProviderProps {
	courses?: unknown[];
	course?: unknown;
	instructors?: unknown[];
	books?: unknown[];
	collections?: unknown[];
	stats?: { collectionsCount: number; articlesCount: number };
}
