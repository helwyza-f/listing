// File: app/(public)/dijual/page.tsx

import { getFilteredProperties } from "@/lib/data";
import PropertyListings from "./PropertyListings";
import "server-only";

export default async function DijualPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsResolved = await searchParams;
  // [PERBAIKAN] Mengurai searchParams menjadi objek yang aman
  const filters = {
    lokasi: searchParamsResolved.lokasi as string | undefined,
    kategori: searchParamsResolved.kategori as string | undefined,
    hargaMin: searchParamsResolved.hargaMin as string | undefined,
    hargaMax: searchParamsResolved.hargaMax as string | undefined,
    urutkan: searchParamsResolved.urutkan as string | undefined,
  };

  const initialData = await getFilteredProperties(filters);
  //   console.log("Initial Data:", initialData);
  return (
    <div className="container px-6">
      <PropertyListings initialData={initialData} />
    </div>
  );
}
