// app/(public)/page.tsx
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // regenerate setiap 5 menit

export default async function HomePage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main>
      <h1>Daftar Properti</h1>
      <ul>
        {properties.map((p) => (
          <li key={p.id}>
            {p.title} - Rp {p.price.toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}
