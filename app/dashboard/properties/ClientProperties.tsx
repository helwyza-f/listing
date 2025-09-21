// app/dashboard/properties/ClientProperties.tsx
"use client";

import Link from "next/link";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ClientProperties({
  initialData,
}: {
  initialData: any[];
}) {
  const { data: properties, mutate } = useSWR("/api/properties", fetcher, {
    fallbackData: initialData, // gunakan hasil ISR sebagai cache awal
    refreshInterval: 30000, // auto update tiap 30 detik
    revalidateOnFocus: true, // update kalau tab aktif lagi
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar List</h1>
        <div className="space-x-2">
          <Link href="/dashboard/properties/new">
            <Button className="bg-green-600">+ Tambah Properti</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary">← Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.map((p: any) => (
          <Card key={p.id} className="overflow-hidden shadow-md">
            <div className="relative">
              <Image
                src={p.thumbnail || p.images?.[0] || "/placeholder.jpg"}
                alt={p.title}
                className="h-48 w-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs rounded">
                Rp {p.price.toLocaleString()}
              </span>
            </div>
            <CardHeader>
              <CardTitle className="truncate">{p.title}</CardTitle>
              <p className="text-sm text-gray-500">{p.location}</p>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm line-clamp-2 text-gray-700"
                dangerouslySetInnerHTML={{ __html: p.description }}
              />
              <div className="flex justify-between mt-4">
                <Link href={`/dashboard/properties/${p.slug}/edit`}>
                  <Button size="sm" className="bg-blue-500">
                    Edit
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await fetch(`/api/properties/${p.slug}`, {
                      method: "DELETE",
                    });
                    mutate(); // refresh data setelah hapus
                  }}
                >
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {properties?.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Belum ada properti ditambahkan.
        </p>
      )}
    </div>
  );
}
