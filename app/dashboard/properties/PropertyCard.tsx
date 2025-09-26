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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FullProperty } from "@/lib/types";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  Bath,
  BedDouble,
  Building,
  ExternalLink,
  LandPlot,
  MapPin,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

// [OPTIMASI] Komponen kecil untuk ikon spesifikasi
function SpecIcon({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value?: string | number | null;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center text-xs text-gray-600">
      <Icon className="w-4 h-4 mr-1 flex-shrink-0" />
      <span>{value}</span>
    </div>
  );
}

// Komponen Kartu Properti Individual yang sudah di-desain ulang
export default function PropertyCard({
  property,
  onMutate,
}: {
  property: FullProperty;
  onMutate: () => void;
}) {
  // [OPTIMASI] Fungsi format harga yang lebih baik (e.g., 700 Juta, 1.5 Miliar)
  const formatPrice = (price: number) => {
    const num = price;
    if (isNaN(num)) return "N/A";

    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
      })} Miliar`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
      })} Juta`;
    }
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const handleDelete = async () => {
    const promise = fetch(`/api/properties/${property.slug}`, {
      method: "DELETE",
    });
    toast.promise(promise, {
      loading: `Menghapus "${property.title}"...`,
      success: () => {
        onMutate();
        return `Properti "${property.title}" berhasil dihapus.`;
      },
      error: `Gagal menghapus properti.`,
    });
  };

  //   const renderSpecs = () => {
  //     switch (property.category) {
  //       case "RUMAH":
  //         const house = property.houseDetails;
  //         if (!house) return null;
  //         return (
  //           <>
  //             <SpecIcon icon={BedDouble} value={house.kamarTidur} />
  //             <SpecIcon icon={Bath} value={house.kamarMandi} />
  //             <SpecIcon icon={Building} value={`${house.luasBangunan} m²`} />
  //             <SpecIcon icon={LandPlot} value={`${house.luasTanah} m²`} />
  //           </>
  //         );
  //       // ... (tambahkan case lain untuk RUKO, APARTEMEN)
  //       case "TANAH":
  //         const land = property.landDetails;
  //         if (!land) return null;
  //         return <SpecIcon icon={LandPlot} value={`${land.luasTanah} m²`} />;
  //       default:
  //         return null;
  //     }
  //   };

  //   [OPTIMASI] Fungsi untuk me-render spesifikasi berdasarkan kategori
  const renderSpecs = () => {
    switch (property.category) {
      case "RUMAH":
        const house = property.houseDetails;
        if (!house) return null;
        return (
          <>
            <SpecIcon icon={BedDouble} value={house.kamarTidur} />
            <SpecIcon icon={Bath} value={house.kamarMandi} />
            <SpecIcon icon={Building} value={`${house.luasBangunan} m²`} />
            <SpecIcon icon={LandPlot} value={`${house.luasTanah} m²`} />
          </>
        );
      case "RUKO":
        const shophouse = property.shophouseDetails;
        if (!shophouse) return null;
        return (
          <>
            <SpecIcon icon={Bath} value={shophouse.kamarMandi} />
            <SpecIcon icon={Building} value={`${shophouse.luasBangunan} m²`} />
            <SpecIcon icon={LandPlot} value={`${shophouse.luasTanah} m²`} />
          </>
        );
      case "APARTEMEN":
        const apartment = property.apartmentDetails;
        if (!apartment) return null;
        return (
          <>
            <SpecIcon icon={BedDouble} value={apartment.kamarTidur} />
            <SpecIcon icon={Bath} value={apartment.kamarMandi} />
            <SpecIcon icon={Building} value={`${apartment.luasBangunan} m²`} />
          </>
        );
      case "TANAH":
        const land = property.landDetails;
        if (!land) return null;
        return <SpecIcon icon={LandPlot} value={`${land.luasTanah} m²`} />;
      default:
        return null;
    }
  };
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col group">
      {/* BAGIAN GAMBAR */}
      <div className="relative">
        <Link href={`/dashboard/properties/${property.slug}`}>
          <Image
            src={
              property.thumbnail ||
              property.images?.[0] ||
              "https://placehold.co/400x300?text=No+Image"
            }
            alt={property.title}
            width={400}
            height={300}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <Badge variant="secondary" className="absolute top-2 left-2 capitalize">
          {property.category.toLowerCase()}
        </Badge>
        <p className="absolute top-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded-full">
          {formatDistanceToNow(new Date(property.updatedAt), {
            addSuffix: true,
            locale: id,
          })}
        </p>
      </div>

      {/* BAGIAN KONTEN */}
      <CardContent className="p-3 flex flex-col flex-grow">
        {/* Baris Spesifikasi */}
        <div className="flex items-center space-x-4 justify-center mb-2 pb-2 border-b">
          {renderSpecs()}
        </div>

        {/* Judul & Lokasi */}
        <div className="flex-grow">
          <h3 className="font-semibold text-base leading-snug line-clamp-2">
            {property.title}
          </h3>
          <p className="text-xs text-gray-500 flex items-center pt-1">
            <MapPin size={12} className="mr-1 flex-shrink-0" />{" "}
            {property.location}
          </p>
        </div>

        {/* Harga & Aksi */}
        <div className="flex justify-between items-end mt-3">
          <div>
            <p className="text-lg font-bold text-green-700">
              Rp. {formatPrice(property.forSaleListing?.price || 0)}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <Link href={`/dashboard/properties/${property.slug}`}>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="destructive" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Aksi ini akan menghapus properti "{property.title}" secara
                    permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Ya, Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
