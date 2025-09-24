import { cache } from "react";
import { unstable_cache as nextCache } from "next/cache";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

// =======================================================
// FUNGSI UNTUK MENGAMBIL SEMUA PROPERTI
// =======================================================
export const getProperties = nextCache(
  cache(async () => {
    return prisma.property.findMany({
      orderBy: { updatedAt: "desc" },
      // [PERBAIKAN] Tambahkan 'where' untuk memfilter data yang tidak valid
      where: {
        category: {
          // Hanya ambil properti yang kategorinya salah satu dari enum
          in: ["RUMAH", "TANAH", "RUKO", "APARTEMEN"],
        },
      },
      include: {
        forSaleListing: true,
        forRentListing: true,
        houseDetails: true,
        landDetails: true,
        shophouseDetails: true,
        apartmentDetails: true,
      },
    });
  }),
  ["properties"],
  {
    tags: ["properties"],
  }
);
// =======================================================
// FUNGSI UNTUK MENGAMBIL SATU PROPERTI
// =======================================================
export async function getPropertyBySlug(slug: string) {
  const cachedPropertyFetcher = nextCache(
    cache(async () => {
      console.log(`Mengambil data dari DB untuk slug: ${slug}`);

      const property = await prisma.property.findUnique({
        where: { slug },
        include: {
          forSaleListing: true,
          forRentListing: true,
          houseDetails: true,
          landDetails: true,
          shophouseDetails: true,
          apartmentDetails: true,
        },
      });

      if (!property) {
        notFound();
      }

      return property;
    }),
    [`property:${slug}`],
    {
      tags: ["properties", `property:${slug}`],
    }
  );

  return cachedPropertyFetcher();
}
