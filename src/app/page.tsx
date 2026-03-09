import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import TrendingSection from '../components/home/TrendingSection';
import PhilosophySection from '../components/home/PhilosophySection';
import VibeSection from '../components/home/VibeSection';
import FloatingChat from '../components/ui/FloatingChat';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrendingSection />
      <PhilosophySection />
      <VibeSection />
      <FloatingChat />
      <Footer />
    </main>
  );
}