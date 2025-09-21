// lib/data.ts (atau di mana pun Anda menempatkan fungsi data fetching)
import { unstable_cache as cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// Fungsi untuk mengambil data properti berdasarkan slug DENGAN CACHE
export const getPropertyBySlug = cache(
  async (slug: string) => {
    console.log(`Menjalankan query database untuk slug: ${slug}`); // Tambahkan ini untuk melihat kapan fungsi dijalankan
    const property = await prisma.property.findUnique({
      where: { slug },
    });
    return property;
  },
  ["property"], // Key-part untuk cache, membantu Next.js mengidentifikasi cache ini
  {
    // Opsi caching
    revalidate: 3600, // Cache akan valid selama 1 jam (3600 detik)
    tags: ["properties"], // Tag umum untuk semua properti
  }
);
