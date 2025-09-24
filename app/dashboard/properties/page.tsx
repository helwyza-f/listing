import { getProperties } from "@/lib/data"; // Menggunakan fungsi cache dari data.ts
import ClientProperties from "./ClientProperties"; // Komponen UI Client
import "server-only";

export default async function PropertiesPage() {
  // Mengambil data awal di server. Ini sangat cepat karena di-cache.
  const initialData = await getProperties();

  return <ClientProperties initialData={initialData} />;
}
