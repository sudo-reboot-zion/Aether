import { Suspense } from 'react';
import ProfileContent from './ProfileContent';

function ProfileSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--c-cream)] text-[var(--t-primary)] font-serif">
      <div className="w-[360px] flex-shrink-0 h-full bg-white/40 animate-pulse" />
      <main className="flex-1 h-full overflow-y-auto p-12 lg:px-16">
        <div className="max-w-[1000px] mx-auto">
          <div className="h-64 bg-white/40 rounded-xl animate-pulse" />
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
