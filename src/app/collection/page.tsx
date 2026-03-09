import { Suspense } from 'react';
import CollectionContent from './CollectionContent';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ListingCardSkeleton from '../../components/ui/ListingCardSkeleton';

function CollectionSkeleton() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-24 px-8 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionContent />
    </Suspense>
  );
}
