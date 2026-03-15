"use client";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { openDialog, resolveDialog } from '@/redux/slices/uiSlice';
import { useCallback, useRef, useEffect } from 'react';

/**
 * Singleton to resolve dialog promises synchronously.
 * This is crucial for Stacks/wallet popups to bypass browser popup blockers
 * which require synchronous execution within a user-interaction tick.
 */
class DialogResolver {
    private static resolver?: (value: any) => void;

    static register(resolver: (value: any) => void) {
        this.resolver = resolver;
    }

    static resolve(value: any) {
        if (this.resolver) {
            this.resolver(value);
            this.resolver = undefined;
        }
    }
}

export function useAetherDialog() {
    const dispatch = useDispatch();
    const { resolveValue, isOpen } = useSelector((state: RootState) => state.ui);
    const resolverRef = useRef<((value: any) => void) | undefined>(undefined);

    const confirm = useCallback((title: string, message: string) => {
        dispatch(openDialog({ title, message, type: 'confirm' }));
        return new Promise<boolean>((resolve) => {
            resolverRef.current = resolve;
            DialogResolver.register(resolve);
        });
    }, [dispatch]);

    const prompt = useCallback((title: string, message: string, defaultValue = '') => {
        dispatch(openDialog({ title, message, type: 'prompt', defaultValue }));
        return new Promise<string | null>((resolve) => {
            resolverRef.current = resolve;
            DialogResolver.register(resolve);
        });
    }, [dispatch]);

    useEffect(() => {
        if (!isOpen && resolveValue !== null && resolverRef.current) {
            // Priority: Resolve through the singleton if called from a UI interaction tick
            // Otherwise fallback to Redux state sync
            resolverRef.current(resolveValue);
            resolverRef.current = undefined;
        }
    }, [isOpen, resolveValue]);

    return { confirm, prompt };
}

export { DialogResolver };
