// File: app/(public)/page.tsx

import { getProperties } from "@/lib/data";
import HeroSection from "@/components/HeroSection";
import LatestListings from "@/components/LatestListings";
import TitipJualSection from "@/components/TitipJualSection";

export default async function HomePage() {
  // Ambil data listing terbaru di server (sangat cepat karena di-cache)
  const latestProperties = await getProperties();

  return (
    <div className="space-y-16 md:space-y-24">
      <HeroSection />
      <LatestListings initialData={latestProperties} />
      <TitipJualSection />
    </div>
  );
}
