import React from 'react';
import '@/components/home/home.css';
import { SiteMotion } from '@/components/site/SiteMotion';
import {
  HomeContact,
  HomeFaq,
  HomeFooter,
  HomeFounders,
  HomeHero,
  HomePrice,
  HomeProcess,
  HomeWork,
} from '@/components/home/sections';

const App: React.FC = () => {
  return (
    <div className="site home">
      <HomeHero />
      <main id="main">
        <HomeWork />
        <HomeFounders />
        <HomePrice />
        <HomeProcess />
        <HomeFaq />
        <HomeContact />
      </main>
      <HomeFooter />
      <SiteMotion />
    </div>
  );
};

export default App;
