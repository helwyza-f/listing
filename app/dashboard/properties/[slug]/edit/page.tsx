// app/dashboard/properties/[slug]/edit/page.tsx

import PropertyForm from "@/components/PropertyForm";

import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/data";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const property = await getPropertyBySlug((await params).slug);

  // Jika properti tidak ditemukan, tampilkan halaman 404
  if (!property) {
    notFound();
  }

  // Render komponen form dengan prop `initialData`
  // Pastikan struktur data `property` sesuai dengan yang diharapkan oleh `PropertyForm`
  return <PropertyForm initialData={property} />;
}
