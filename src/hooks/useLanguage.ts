'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux';
import { setLanguage } from '@/redux/slices/languageSlice';

export const useLanguage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

    const changeLanguage = (lang: string) => {
        dispatch(setLanguage(lang));
    };

    return {
        language: currentLanguage,
        changeLanguage,
    };
};
