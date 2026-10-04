import React from 'react';
import PageTransition from '../components/layout/PageTransition';
import HeroMuseum from '../components/home/HeroMuseum';
import FeaturedArtifact from '../components/home/FeaturedArtifact';
import ExploreRooms from '../components/home/ExploreRooms';
import CuratedOfTheDay from '../components/home/CuratedOfTheDay';
import TimelinePreview from '../components/home/TimelinePreview';
import FeaturedArtists from '../components/home/FeaturedArtists';

export default function Home() {
  return (
    <PageTransition>
      <HeroMuseum />
      <FeaturedArtifact />
      <ExploreRooms />
      <CuratedOfTheDay />
      <TimelinePreview />
      <FeaturedArtists />
    </PageTransition>
  );
}
