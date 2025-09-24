"use client";

import Link from "next/link";
import useSWR from "swr";

import { FullProperty } from "@/lib/types"; // Tipe data terpusat kita
import PropertyCard from "./PropertyCard";

import { Button } from "@/components/ui/button";

import { PlusCircle, LayoutDashboard, Home, AlertTriangle } from "lucide-react";

// Fungsi fetcher untuk SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Gagal mengambil data properti.");
    return res.json();
  });

// Komponen Utama
export default function ClientProperties({
  initialData,
}: {
  initialData: FullProperty[];
}) {
  const {
    data: properties,
    error,
    mutate,
  } = useSWR<FullProperty[]>("/api/properties", fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: true, // Auto-update saat tab kembali aktif
  });

  if (error) {
    return (
      <div className="text-center py-16 px-6 bg-red-50 border-2 border-red-200 border-dashed rounded-lg">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-xl font-semibold text-red-900">
          Oops, Gagal Memuat Data
        </h3>
        <p className="mt-1 text-sm text-red-700">{error.message}</p>
        <div className="mt-6">
          <Button onClick={() => mutate()} variant="destructive">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Kelola Properti Anda</h1>
          <p className="text-gray-500">
            Total {properties?.length || 0} properti ditemukan.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <Button variant="outline">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/properties/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Properti
            </Button>
          </Link>
        </div>
      </div>

      {properties && properties.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} onMutate={mutate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 border-2 border-dashed rounded-lg">
          <Home className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-xl font-semibold text-gray-900">
            Belum Ada Properti
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Mulai dengan menambahkan properti pertama Anda.
          </p>
        </div>
      )}
    </div>
  );
}
