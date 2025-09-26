import { getPropertyBySlug } from "@/lib/data";
import PublicPropertyView from "@/components/PublicPropertyView"; // Komponen UI Client
import "server-only";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 1. Ambil data di server (super cepat karena di-cache)
  const property = await getPropertyBySlug((await params).slug);

  // 2. Render komponen client dengan data yang sudah siap
  return <PublicPropertyView property={property} />;
}
