import { useSelector } from 'react-redux';
import { translations, Language } from '../constants/translations';

export const useTranslation = () => {
    const currentLanguage = useSelector((state: any) => state.language.currentLanguage) as Language;

    const t = (path: string) => {
        const keys = path.split('.');
        let value: any = translations[currentLanguage];

        for (const key of keys) {
            if (value && value[key]) {
                value = value[key];
            } else {
                return path; 
            }
        }

        return value;
    };

    return { t, currentLanguage };
};
