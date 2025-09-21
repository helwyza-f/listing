// app/dashboard/properties/[slug]/page.tsx
import { getPropertyBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import "server-only";

// Impor komponen client yang akan kita buat
import PropertyDetailsClientView from "@/components/PropertyDetailsClientView";

// =======================================================
//   SERVER COMPONENT (UNTUK FETCHING DATA)
// =======================================================
export default async function DetailPropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 1. Mengambil data asli dari database
  const property = await getPropertyBySlug((await params).slug);

  // 2. Jika data tidak ditemukan, tampilkan halaman 404
  if (!property) {
    notFound();
  }

  // 3. Me-render Client Component dan meneruskan data properti
  return <PropertyDetailsClientView property={property} />;
}
