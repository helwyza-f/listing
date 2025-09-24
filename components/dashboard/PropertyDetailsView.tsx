"use client";

import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";
import { toast } from "sonner";
import { mutate } from "swr";
import { Calculator } from "lucide-react"; // Tambahkan ikon
import KprCalculator from "@/components/KprCalculator"; // Impor komponen baru

// Tipe & Komponen UI
import { FullProperty } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// [DIUBAH] Impor fungsi render spesifikasi dari file terpisah
import { renderSpecifications } from "./specs";

// Ikon
import {
  MapPin,
  ChevronLeft,
  Edit,
  Eye,
  Trash2,
  Sparkles,
  XCircle,
  GalleryVertical,
} from "lucide-react";

export default function PropertyDetailsView({
  property,
}: {
  property: FullProperty;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const galleryImages = property.images.slice(0, 5);

  const handleDelete = async () => {
    const promise = fetch(`/api/properties/${property.slug}`, {
      method: "DELETE",
    });
    toast.promise(promise, {
      loading: `Menghapus "${property.title}"...`,
      success: () => {
        mutate("/api/properties");
        window.location.href = "/dashboard/properties";
        return `Properti "${property.title}" berhasil dihapus.`;
      },
      error: `Gagal menghapus properti.`,
    });
  };

  const formatPrice = (price: string) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(price));

  return (
    <>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={property.images.map((src) => ({ src }))}
      />
      <div className="p-4 md:p-6 space-y-6">
        {/* Header Navigasi */}
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <Link
            href="/dashboard/properties"
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" /> Lihat Publik
            </Button>
            <Link href={`/dashboard/properties/${property.slug}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" /> Edit Properti
              </Button>
            </Link>
          </div>
        </div>

        {/* [LAYOUT BARU] Galeri Gambar Fokus di Atas */}
        <div className="w-full h-[450px] rounded-lg overflow-hidden relative">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 w-full h-full">
            {/* Gambar Utama */}
            <div className="col-span-2 row-span-2 relative group">
              <Image
                src={
                  galleryImages[0] ||
                  "https://placehold.co/800x600?text=No+Image"
                }
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            {/* Gambar Kecil */}
            {galleryImages.slice(1, 5).map((img, index) => (
              <div key={index} className="relative group">
                <Image
                  src={img}
                  alt={`${property.title} - ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <Button
            variant="secondary"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-4 right-4 z-10"
          >
            <GalleryVertical className="w-4 h-4 mr-2" />
            Lihat Semua {property.images.length} Gambar
          </Button>
        </div>

        {/* [LAYOUT BARU] Konten di Bawah Galeri */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                  className="prose prose-sm max-w-none "
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
                    Spesifikasi Utama
                  </h3>
                  <div className="space-y-3">
                    {renderSpecifications(property)}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Fitur & Fasilitas
                  </h3>
                  <div className="space-y-2">
                    {property.features && property.features.length > 0 ? (
                      property.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Sparkles className="w-4 h-4 mr-3 text-yellow-500 flex-shrink-0" />
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
            {/* [BARU] Tampilkan Kalkulator KPR di sini */}
            {property.forSaleListing && (
              <KprCalculator
                initialPrice={Number(property.forSaleListing.price)}
              />
            )}
          </div>

          {/* Kolom Kanan (Sidebar Sticky) */}
          <div className="lg:sticky top-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Penawaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.forSaleListing ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Harga Jual</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(property.forSaleListing.price)}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <XCircle className="w-4 h-4 mr-2 text-red-500" /> Tidak
                    Dijual
                  </div>
                )}

                {property.forRentListing ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Harga Sewa</p>
                    <p className="text-xl font-bold">
                      {formatPrice(property.forRentListing.price)}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        / {property.forRentListing.period.toLowerCase()}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <XCircle className="w-4 h-4 mr-2 text-red-500" /> Tidak
                    Disewa
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Informasi Listing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>Status Aktif</span>
                  <Badge
                    variant={property.isActive ? "default" : "secondary"}
                    className={
                      property.isActive ? "bg-green-100 text-green-800" : ""
                    }
                  >
                    {property.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Diperbarui</span>
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(property.updatedAt), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">
                  Zona Berbahaya
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive/90 mb-4">
                  Aksi ini tidak dapat dibatalkan dan akan menghapus properti
                  secara permanen.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" /> Hapus Properti Ini
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Anda Benar-Benar Yakin?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Anda akan menghapus properti "{property.title}". Data
                        yang sudah dihapus tidak bisa dikembalikan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Ya, Hapus Sekarang
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
