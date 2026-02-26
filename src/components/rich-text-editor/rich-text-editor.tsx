'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const annotationModules = {
	toolbar: [
		[{ header: [1, 2, 3, false] }],
		['bold', 'italic', 'underline'],
		[{ list: 'ordered' }, { list: 'bullet' }],
		['link'],
		['clean'],
	],
};

interface RichTextEditorProps {
	value: string;
	onChange: (html: string) => void;
	placeholder?: string;
	minHeight?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder, minHeight = '120px' }: RichTextEditorProps) => {
	return (
		<ReactQuill
			theme="snow"
			value={value}
			onChange={onChange}
			modules={annotationModules}
			placeholder={placeholder}
			style={{ minHeight }}
		/>
	);
};
