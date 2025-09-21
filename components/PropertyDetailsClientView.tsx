// components/PropertyDetailsClientView.tsx
"use client";

import { useState } from "react";
// --- PERUBAHAN 1: Impor 'format' dari date-fns ---
import { format } from "date-fns";

// Impor komponen UI dan Ikon
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  DollarSign,
  PenSquare,
  ChevronLeft,
  CheckCircle,
  CalendarDays,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import Link from "next/link";

// Tipe data yang sesuai dengan data yang dikirim dari server
type Property = {
  _id?: any;
  title: string;
  slug: string;
  description: string;
  price: string;
  location: string;
  features: string[];
  images: string[];
  thumbnail: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// =======================================================
//   CLIENT COMPONENT (UNTUK MENAMPILKAN UI & INTERAKSI)
// =======================================================
export default function PropertyDetailsClientView({
  property,
}: {
  property: Property;
}) {
  // --- PERUBAHAN 2: Menambahkan fallback jika thumbnail null ---
  const [activeImage, setActiveImage] = useState(
    property.thumbnail ||
      property.images[0] ||
      "https://placehold.co/1280x720?text=Gambar+Tidak+Tersedia"
  );

  const formatPrice = (price: string) => {
    // const number = parseInt(price.replace(/[^0-9]/g, ""), 10);
    // if (isNaN(number)) return "Harga tidak valid";
    // return new Intl.NumberFormat("id-ID", {
    //   style: "currency",
    //   currency: "IDR",
    //   minimumFractionDigits: 0,
    // }).format(number);
    return price;
  };

  // --- PERUBAHAN 3: Menggunakan 'format' dari date-fns ---
  const formatDate = (dateObject: Date) => {
    // Format tanggal menjadi '21 September 2025'
    return format(dateObject, "dd MMMM yyyy");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-sans bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <Link
          href="/dashboard/properties"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={18} className="mr-1" />
          Kembali ke Daftar Properti
        </Link>
        <a href={`/dashboard/properties/${property.slug}/edit`}>
          <Button variant="outline">
            <PenSquare size={16} className="mr-2" />
            Edit Properti
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <div className="mb-4 border-b pb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              {property.title}
            </h1>
            <div className="flex items-center text-gray-500 mt-2">
              <MapPin size={16} className="mr-2" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="aspect-video w-full relative mb-2 rounded-lg overflow-hidden border">
              <img
                src={activeImage}
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {property.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-24 h-16 relative rounded-md overflow-hidden transition-all duration-200 border ${
                    activeImage === img
                      ? "ring-2 ring-green-500 ring-offset-2"
                      : "hover:opacity-80"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Deskripsi
            </h2>
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: property.description }}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start mb-6 border-b pb-6">
              <DollarSign
                className="text-green-600 mt-1 mr-4 flex-shrink-0"
                size={28}
              />
              <div>
                <p className="text-sm text-gray-500">Harga</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatPrice(property.price)}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center">
                {property.isActive ? (
                  <ShieldCheck className="w-5 h-5 mr-3 text-green-500" />
                ) : (
                  <ShieldOff className="w-5 h-5 mr-3 text-gray-400" />
                )}
                <span className="font-semibold mr-2">Status:</span>
                {property.isActive ? (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Aktif / Tersedia
                  </Badge>
                ) : (
                  <Badge variant="secondary">Tidak Aktif</Badge>
                )}
              </div>
              <div className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-3 text-gray-400" />
                <span className="font-semibold mr-2">Diperbarui:</span>
                <span className="text-gray-600">
                  {formatDate(property.updatedAt)}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 my-6">
              Fitur Unggulan
            </h3>
            <div className="space-y-3">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <CheckCircle
                    size={18}
                    className="text-green-500 mr-3 flex-shrink-0"
                  />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
