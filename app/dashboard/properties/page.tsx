"use client";

import { useEffect, useState } from "react";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then(setProperties);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Daftar Properti</h1>
      <a
        href="/dashboard/properties/new"
        className="mb-4 inline-block px-3 py-2 bg-green-600 text-white rounded"
      >
        + Tambah Properti
      </a>
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
          {properties.map((p) => (
            <tr key={p.id}>
              <td className="border px-2 py-1">{p.title}</td>
              <td className="border px-2 py-1">{p.location}</td>
              <td className="border px-2 py-1">
                Rp {p.price.toLocaleString()}
              </td>
              <td className="border px-2 py-1 space-x-2">
                <a
                  href={`/dashboard/properties/${p.id}/edit`}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </a>
                <button
                  onClick={async () => {
                    await fetch(`/api/properties/${p.id}`, {
                      method: "DELETE",
                    });
                    setProperties((prev) => prev.filter((x) => x.id !== p.id));
                  }}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
