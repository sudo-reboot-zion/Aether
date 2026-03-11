'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { userSession } from '@/lib/stacks';
import { setUserData, setLoading } from '@/redux/slices/userSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const handleAuth = async () => {
            if (userSession.isSignInPending()) {
                try {
                    const data = await userSession.handlePendingSignIn();
                    dispatch(setUserData(data));
                    // Redirect to collection or dashboard after successful sign-in
                    router.push('/collection');
                } catch (error) {
                    console.error("Error handling pending sign-in:", error);
                    dispatch(setLoading(false));
                }
            } else if (userSession.isUserSignedIn()) {
                // This is already handled by initial state in userSlice, 
                // but we can ensure consistency here
                const data = userSession.loadUserData();
                dispatch(setUserData(data));
            } else {
                dispatch(setLoading(false));
            }
        };

        handleAuth();
    }, [dispatch, router]);

    return <>{children}</>;
}
