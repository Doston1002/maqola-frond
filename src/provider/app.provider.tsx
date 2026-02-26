import { FC, ReactNode } from 'react';

interface Props {
	children: ReactNode;
	courses?: unknown[];
	course?: unknown;
	instructors?: unknown[];
	books?: unknown[];
	collections?: unknown[];
	stats?: { collectionsCount: number; articlesCount: number };
}

const AppProvider: FC<Props> = ({ children }): JSX.Element => {
	return <>{children}</>;
};

export default AppProvider;
