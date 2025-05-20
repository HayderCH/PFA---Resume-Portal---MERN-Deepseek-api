
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import StatisticsSection from '@/components/home/StatisticsSection';
import CTASection from '@/components/home/CTASection';

const Index: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <StatisticsSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
