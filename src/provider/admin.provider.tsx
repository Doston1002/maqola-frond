import { FC, ReactNode } from 'react';

interface Props {
	children: ReactNode;
	courses?: unknown[];
	instructors?: unknown[];
	users?: unknown[];
	books?: unknown[];
}

const AdminProvider: FC<Props> = ({ children }): JSX.Element => {
	return <>{children}</>;
};

export default AdminProvider;
