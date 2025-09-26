// File: components/HeroSection.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dijual?lokasi=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center">
      {/* Ganti URL gambar ini dengan gambar latar belakang ikonik Batam */}
      <div className="absolute inset-0 bg-cover bg-center bg-teal-900 bg-blend-multiply bg-[url('https://placehold.co/1920x1080/004D40/FFFFFF?text=Welcome+to+Batam')]"></div>

      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Portal Properti Terlengkap di Batam
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">
          Temukan rumah, ruko, tanah, dan apartemen impian Anda dengan mudah.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-8 max-w-xl mx-auto flex w-full items-center space-x-2 bg-white rounded-full p-2 shadow-lg"
        >
          <div className="pl-4 pr-2">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Cari berdasarkan lokasi atau area di Batam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none focus-visible:ring-0 text-base text-gray-800"
          />
          <Button
            type="submit"
            className="rounded-full px-6 bg-amber-500 hover:bg-amber-600 text-teal-900 font-bold"
          >
            Cari
          </Button>
        </form>
      </div>
    </div>
  );
}
