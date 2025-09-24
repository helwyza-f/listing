// app/(public)/page.tsx
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // regenerate setiap 5 menit

export default async function HomePage() {
  const totalProperties = await prisma.property.count();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">
        Selamat Datang di Aplikasi Properti!
      </h1>
      <p className="text-lg text-center mb-8 px-4">
        Jelajahi berbagai properti yang tersedia dan temukan rumah impian Anda.
      </p>
      <div className="text-center">
        <p className="text-xl mb-2">Total Properti Terdaftar:</p>
        <p className="text-3xl font-semibold">{totalProperties}</p>
      </div>
    </div>
  );
}
