import { getPropertyBySlug } from "@/lib/data";
import PropertyForm from "@/components/dashboard/PropertyForm"; // Kita akan gunakan form yang sama
import { Separator } from "@/components/ui/separator";
import "server-only";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Ambil data awal properti di server
  const property = await getPropertyBySlug((await params).slug);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Properti</h1>
        <p className="text-muted-foreground">
          Anda sedang memperbarui detail untuk:{" "}
          <span className="font-semibold">{property.title}</span>
        </p>
      </div>
      <Separator />

      {/* Me-render form dalam mode edit dengan memberikan initialData */}
      <PropertyForm initialData={property} />
    </div>
  );
}
