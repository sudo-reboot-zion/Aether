"use client";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { openDialog, resolveDialog } from '@/redux/slices/uiSlice';
import { useCallback, useRef, useEffect } from 'react';

export function useAetherDialog() {
    const dispatch = useDispatch();
    const { resolveValue, isOpen } = useSelector((state: RootState) => state.ui);
    const resolverRef = useRef<((value: any) => void) | undefined>(undefined);

    const confirm = useCallback((title: string, message: string) => {
        dispatch(openDialog({ title, message, type: 'confirm' }));
        return new Promise<boolean>((resolve) => {
            resolverRef.current = resolve;
        });
    }, [dispatch]);

    const prompt = useCallback((title: string, message: string, defaultValue = '') => {
        dispatch(openDialog({ title, message, type: 'prompt', defaultValue }));
        return new Promise<string | null>((resolve) => {
            resolverRef.current = resolve;
        });
    }, [dispatch]);

    useEffect(() => {
        if (!isOpen && resolveValue !== null && resolverRef.current) {
            resolverRef.current(resolveValue);
            resolverRef.current = undefined;
        }
    }, [isOpen, resolveValue]);

    return { confirm, prompt };
}
