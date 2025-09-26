"use client";

import { useState } from "react";
import useSWR from "swr";
import { FullProperty } from "@/lib/types";
import PublicPropertyCard from "@/components/PublicPropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PropertyListings({
  initialData,
}: {
  initialData: FullProperty[];
}) {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    lokasi: searchParams.get("lokasi") || "",
    kategori: searchParams.get("kategori") || "",
    hargaMin: searchParams.get("hargaMin") || "",
    hargaMax: searchParams.get("hargaMax") || "",
    urutkan: searchParams.get("urutkan") || "updatedAt_desc",
  });

  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  };

  const {
    data: properties,
    error,
    isLoading,
  } = useSWR(`/api/properties?${buildQueryString()}`, fetcher, {
    fallbackData: initialData,
  });

  // [PERBAIKAN] Logika diubah untuk menangani nilai "all"
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    // Jika pengguna memilih "all", kita set state-nya menjadi string kosong
    setFilters((prev) => ({ ...prev, [key]: value === "all" ? "" : value }));
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Properti Dijual</h1>
        <p className="text-muted-foreground">
          Temukan properti yang sesuai dengan kriteria Anda di Batam.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 border rounded-lg bg-background">
        <div className="col-span-2">
          <Input
            placeholder="Cari lokasi..."
            value={filters.lokasi}
            onChange={(e) => handleFilterChange("lokasi", e.target.value)}
          />
        </div>
        <div>
          <Select
            value={filters.kategori || "all"}
            onValueChange={(value) => handleFilterChange("kategori", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipe Properti" />
            </SelectTrigger>
            <SelectContent>
              {/* [PERBAIKAN] Menggunakan value="all" */}
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="RUMAH">Rumah</SelectItem>
              <SelectItem value="TANAH">Tanah</SelectItem>
              <SelectItem value="RUKO">Ruko</SelectItem>
              <SelectItem value="APARTEMEN">Apartemen</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filters.hargaMax || "all"}
            onValueChange={(value) => handleFilterChange("hargaMax", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Harga Maksimal" />
            </SelectTrigger>
            <SelectContent>
              {/* [PERBAIKAN] Menggunakan value="all" */}
              <SelectItem value="all">Semua Harga</SelectItem>
              <SelectItem value="500000000">Rp 500 Juta</SelectItem>
              <SelectItem value="1000000000">Rp 1 Miliar</SelectItem>
              <SelectItem value="2000000000">Rp 2 Miliar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filters.urutkan}
            onValueChange={(value) => handleFilterChange("urutkan", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt_desc">Terbaru</SelectItem>
              <SelectItem value="harga_asc">Harga Terendah</SelectItem>
              <SelectItem value="harga_desc">Harga Tertinggi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      )}

      {!isLoading && properties && properties.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Menampilkan {properties.length} hasil.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property: FullProperty) => (
              <PublicPropertyCard key={property.id} property={property} />
            ))}
          </div>
        </>
      )}

      {!isLoading && (!properties || properties.length === 0) && (
        <div className="text-center py-16 px-6 border-2 border-dashed rounded-lg">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-xl font-semibold text-gray-900">
            Properti Tidak Ditemukan
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Coba ubah atau hapus beberapa filter Anda.
          </p>
        </div>
      )}
    </div>
  );
}
