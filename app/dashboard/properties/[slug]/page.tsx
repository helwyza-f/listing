import { getPropertyBySlug } from "@/lib/data";
import PropertyDetailsView from "@/components/dashboard/PropertyDetailsView";
import { FullProperty } from "@/lib/types"; // Impor tipe
import "server-only";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const property: FullProperty = await getPropertyBySlug((await params).slug);

  return <PropertyDetailsView property={property} />;
}
