import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux';
import { fetchSessions } from '@/redux/slices/bookingChatSlice';
import { useAuth } from './useAuth';

export const useNavbarNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useAuth();
  const { isOpen: isChatOpen } = useSelector((state: RootState) => state.bookingChat);

  useEffect(() => {
    const address = userData?.profile?.stxAddress?.testnet;
    if (!address) return;

    // Initial fetch
    dispatch(fetchSessions(address));

    // Poll every 30 seconds
    const interval = setInterval(() => {
      if (!isChatOpen) {
        dispatch(fetchSessions(address));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [userData, dispatch, isChatOpen]);
};
