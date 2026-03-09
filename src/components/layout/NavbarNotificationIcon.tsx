"use client";
import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux';
import { clearNotifications } from '@/redux/slices/bookingChatSlice';

const NavbarNotificationIcon: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hasNotifications } = useSelector((state: RootState) => state.bookingChat);

  return (
    <Link
      href="/profile?tab=messages"
      onClick={() => dispatch(clearNotifications())}
      className="relative p-2 rounded-full hover:bg-[var(--c-blue-deep)]/5 transition-colors group"
    >
      <MessageSquare className="w-5 h-5 text-[var(--t-secondary)] group-hover:text-[var(--c-blue-deep)] transition-colors opacity-70" />
      {hasNotifications && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </Link>
  );
};

export default NavbarNotificationIcon;
