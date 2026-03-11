"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import { fetchFavorites } from '@/redux/slices/favoritesSlice';
import { RootState } from '@/redux';

export default function FavoritesMount() {
    const dispatch = useDispatch();
    const { userData } = useAuth();
    const userAddress = userData?.profile?.stxAddress?.testnet || '';
    const { savedIds, isFetching } = useSelector((state: RootState) => state.favorites);

    useEffect(() => {
        if (userAddress && savedIds.length === 0 && !isFetching) {
            dispatch(fetchFavorites(userAddress) as any);
        }
    }, [userAddress, dispatch, savedIds.length, isFetching]);

    return null;
}
