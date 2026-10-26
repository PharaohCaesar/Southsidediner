import { GriddleHero } from '@/components/hero/griddle-hero';
import { KitchenGallery } from '@/components/home/kitchen-gallery';
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
      <KitchenGallery />
      <ChromeDivider />
      <VisitBand />
    </>
  );
}
