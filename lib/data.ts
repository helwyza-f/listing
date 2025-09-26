// lib/data.ts
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

// [PERBAIKAN] Fungsi ini sekarang menerima objek 'filters' biasa
export async function getFilteredProperties(filters: {
  [key: string]: string | undefined;
}) {
  const {
    lokasi,
    kategori,
    hargaMin,
    hargaMax,
    urutkan = "updatedAt_desc",
  } = filters;

  const where: any = {
    category: { in: ["RUMAH", "TANAH", "RUKO", "APARTEMEN"] },
    // [PERBAIKAN] Sintaks yang benar untuk filter relasi
    forSaleListing: {
      isActive: true,
    },
  };

  if (lokasi) {
    where.location = { contains: lokasi, mode: "insensitive" };
  }
  if (kategori) {
    where.category = kategori;
  }
  if (hargaMin) {
    const min = parseInt(hargaMin, 10);
    if (!isNaN(min)) {
      where.forSaleListing.price = { ...where.forSaleListing.price, gte: min };
    }
  }
  if (hargaMax) {
    const max = parseInt(hargaMax, 10);
    if (!isNaN(max)) {
      where.forSaleListing.price = { ...where.forSaleListing.price, lte: max };
    }
  }

  let orderBy: any = {};
  if (urutkan === "harga_asc") {
    orderBy = { forSaleListing: { price: "asc" } };
  } else if (urutkan === "harga_desc") {
    orderBy = { forSaleListing: { price: "desc" } };
  } else {
    orderBy = { updatedAt: "desc" };
  }

  return prisma.property.findMany({
    where,
    orderBy,
    include: {
      forSaleListing: true,
      forRentListing: true,
      houseDetails: true,
      landDetails: true,
      shophouseDetails: true,
      apartmentDetails: true,
    },
  });
}
