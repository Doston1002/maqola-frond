import { Dispatch, SetStateAction } from 'react';
import { SectionType } from 'src/interfaces/instructor.interface';

export interface SectionAccordionProps {
	section: SectionType;
    setSectionTitle: Dispatch<SetStateAction<{
        title: string;
        id: string;
        firstLesson?: any | null;
    } | null>>;
	onOpen: () => void;
	sectionIdx: number;
}
