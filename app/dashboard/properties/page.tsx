// app/dashboard/properties/page.tsx
import Link from "next/link";

async function getProperties() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`,
    {
      cache: "force-cache", // default, bisa juga pakai "no-store"
      next: { revalidate: 60 }, // ISR: revalidate tiap 60 detik
    }
  );
  return res.json();
}

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Daftar Properti</h1>
      <Link
        href="/dashboard/properties/new"
        className="mb-4 inline-block px-3 py-2 bg-green-600 text-white rounded"
      >
        + Tambah Properti
      </Link>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Judul</th>
            <th className="border px-2 py-1">Lokasi</th>
            <th className="border px-2 py-1">Harga</th>
            <th className="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p: any) => (
            <tr key={p.id}>
              <td className="border px-2 py-1">{p.title}</td>
              <td className="border px-2 py-1">{p.location}</td>
              <td className="border px-2 py-1">
                Rp {p.price.toLocaleString()}
              </td>
              <td className="border px-2 py-1 space-x-2">
                <Link
                  href={`/dashboard/properties/${p.id}/edit`}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
