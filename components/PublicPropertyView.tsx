"use client";

import { useState } from "react";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";

// Tipe & Komponen UI
import { FullProperty } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { renderSpecifications } from "@/components/dashboard/specs"; // Fungsi render spesifikasi kita
import KprCalculator from "./KprCalculator"; // Kalkulator KPR

// Ikon
import {
  MapPin,
  Sparkles,
  GalleryVertical,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function PublicPropertyView({
  property,
}: {
  property: FullProperty;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Mengambil 5 gambar pertama untuk ditampilkan di galeri
  const galleryImages = property.images.slice(0, 5);

  const formatPrice = (price?: number | null) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Placeholder untuk nomor WhatsApp agen
  const agentWhatsAppNumber = "6281234567890";
  const whatsAppMessage = `Halo, saya tertarik dengan properti "${property.title}" yang ada di Batam Properties. Apakah masih tersedia?`;
  const whatsAppLink = `https://api.whatsapp.com/send?phone=${agentWhatsAppNumber}&text=${encodeURIComponent(
    whatsAppMessage
  )}`;

  return (
    <>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={property.images.map((src) => ({ src }))}
      />
      <div className="bg-slate-50">
        <div className="container py-8 space-y-6 px-4">
          {/* BAGIAN 1: GALERI GAMBAR FOKUS */}
          <div className="w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden relative">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 w-full h-full">
              <button
                onClick={() => setLightboxOpen(true)}
                className="col-span-4 md:col-span-2 row-span-2 relative group block"
              >
                <Image
                  src={
                    galleryImages[0] ||
                    "https://placehold.co/800x600?text=Batam+Properties"
                  }
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
              </button>
              {galleryImages.slice(1, 5).map((img, index) => (
                <button
                  onClick={() => setLightboxOpen(true)}
                  key={index}
                  className="relative group hidden md:block"
                >
                  <Image
                    src={img}
                    alt={`${property.title} - ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                </button>
              ))}
            </div>
            <Button
              variant="secondary"
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 z-10 shadow-lg"
            >
              <GalleryVertical className="w-4 h-4 mr-2" />
              Lihat Semua {property.images.length} Gambar
            </Button>
          </div>

          {/* BAGIAN 2: KONTEN & SIDEBAR */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start ">
            {/* Kolom Kiri (Lebar) */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit capitalize">
                    {property.category.toLowerCase()}
                  </Badge>
                  <CardTitle className="text-3xl font-bold">
                    {property.title}
                  </CardTitle>
                  <p className="text-muted-foreground flex items-center pt-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    {property.location}
                  </p>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-xl mb-2">
                    Deskripsi Properti
                  </h3>
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: property.description }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detail & Fasilitas</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">
                      Spesifikasi
                    </h3>
                    <div className="space-y-3">
                      {renderSpecifications(property)}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">
                      Fitur Unggulan
                    </h3>
                    <div className="space-y-2">
                      {property.features && property.features.length > 0 ? (
                        property.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm"
                          >
                            <Sparkles className="w-4 h-4 mr-3 text-amber-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Tidak ada fitur tambahan.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tampilkan Kalkulator KPR hanya jika properti dijual */}
              {property.forSaleListing && (
                <KprCalculator initialPrice={property.forSaleListing.price} />
              )}
            </div>

            {/* Kolom Kanan (Sidebar Sticky) */}
            <div className="lg:sticky top-20 space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="bg-slate-100 flex flex-row items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-white">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="Agen Properti"
                    />
                    <AvatarFallback>BP</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      Agen Batam Properties
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Agen Terverifikasi
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {property.forSaleListing && (
                    <div className="text-center border-b pb-4">
                      <p className="text-sm text-muted-foreground">
                        Harga Jual
                      </p>
                      <p className="text-3xl font-bold text-teal-800">
                        {formatPrice(property.forSaleListing.price)}
                      </p>
                    </div>
                  )}
                  {property.forRentListing && (
                    <div className="text-center border-b pb-4">
                      <p className="text-sm text-muted-foreground">
                        Harga Sewa
                      </p>
                      <p className="text-2xl font-bold text-teal-800">
                        {formatPrice(property.forRentListing.price)}{" "}
                        <span className="text-base font-normal text-muted-foreground">
                          / {property.forRentListing.period.toLowerCase()}
                        </span>
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <a
                        href={whatsAppLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" /> Hubungi via
                        WhatsApp
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" className="w-full">
                      <Phone className="w-5 h-5 mr-2" /> Tampilkan Nomor Telepon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
