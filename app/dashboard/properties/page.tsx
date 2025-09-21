// app/dashboard/properties/page.tsx
import ClientProperties from "./ClientProperties";
import { prisma } from "@/lib/prisma";

async function getProperties() {
  return prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function PropertiesPage() {
  const initialData = await getProperties(); // langsung dari DB

  return <ClientProperties initialData={initialData} />;
}
