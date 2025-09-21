// app/dashboard/properties/edit/[slug]/page.tsx

import PropertyForm from "@/components/PropertyForm";
import { prisma } from "@/lib/prisma"; // Asumsi Anda menggunakan Prisma
import { notFound } from "next/navigation";

// Fungsi untuk mengambil data properti berdasarkan slug
async function getProperty(slug: string) {
  const property = await prisma.property.findUnique({
    where: { slug },
  });
  return property;
}

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const property = await getProperty((await params).slug);

  // Jika properti tidak ditemukan, tampilkan halaman 404
  if (!property) {
    notFound();
  }

  // Render komponen form dengan prop `initialData`
  // Pastikan struktur data `property` sesuai dengan yang diharapkan oleh `PropertyForm`
  return <PropertyForm initialData={property} />;
}
