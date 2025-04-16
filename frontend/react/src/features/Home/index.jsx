import React from 'react';
import HeroSlider from './components/HeroSlider';
import DonationEventSection from './components/DonationEventSection';
import FeatureSection from './components/FeatureSection';
import SuccessStories from './components/SuccessStories';
import ImpactCounter from './components/ImpactCounter';
import EnhancedChatbotWidget from './components/EnhancedChatbotWidget';

const Home = () => {
  return (
    <div className="home-container">
      <HeroSlider />
      <ImpactCounter />
      <DonationEventSection />
      <FeatureSection />
      <SuccessStories />
      <EnhancedChatbotWidget />
    </div>
  );
};

export default Home;