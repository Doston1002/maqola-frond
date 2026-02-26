import { useTranslation } from 'react-i18next';
import { withLayout } from 'src/layouts/layout';
import Seo from 'src/layouts/seo/seo';
import { AttendancePageComponent } from 'src/page-component';

const AttendancePage = () => {
    const { t } = useTranslation();

    return (
        <Seo
            metaTitle={
                `Uyda ta'lim | ${t('contact_page_title', { ns: 'seo' })}` ||
                'Uyda ta\'lim  | Contact us'
            }
            metaDescription={
                `Uyda ta'lim  | ${t('contact_page_description', { ns: 'seo' })}` ||
                'Contact with Sammi and you can ask any questions'
            }
        >
            <AttendancePageComponent />
        </Seo>
    );
};

export default withLayout(AttendancePage);
