import { GriddleHero } from '@/components/hero/griddle-hero';
import { Jukebox } from '@/components/jukebox';
import { StoryStrip } from '@/components/home/story-strip';
import { ChromeDivider } from '@/components/chrome-divider';
import { VisitBand } from '@/components/home/visit-band';
import { JsonLd } from '@/components/json-ld';

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <GriddleHero />
      <ChromeDivider />
      <StoryStrip />
      <ChromeDivider />
      <Jukebox />
      <ChromeDivider />
      <VisitBand />
    </>
  );
}
