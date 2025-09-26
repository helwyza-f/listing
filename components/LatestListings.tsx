"use client";

import { FullProperty } from "@/lib/types";
import PublicPropertyCard from "./PublicPropertyCard";
import { Button } from "./ui/button";
import Link from "next/link";

export default function LatestListings({
  initialData,
}: {
  initialData: FullProperty[];
}) {
  // Tampilkan hanya 8 listing terbaru di homepage
  const properties = initialData.slice(0, 8);

  return (
    <div className="container px-4">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Listing Terbaru</h2>
          <p className="text-muted-foreground">
            Properti pilihan yang baru saja kami tambahkan.
          </p>
        </div>
        <Link href="/dijual">
          <Button variant="outline">Lihat Semua</Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PublicPropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
