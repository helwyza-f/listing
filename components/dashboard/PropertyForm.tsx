"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { FullProperty } from "@/lib/types"; // Tipe data lengkap

type initialData = FullProperty | null;
// Impor komponen UI dan Ikon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, UploadCloud, GripVertical } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { Separator } from "@radix-ui/react-separator";
import { redirect } from "next/navigation";

// Tipe data untuk state form
type FormState = {
  title: string;
  description: string;
  location: string;
  category?: "RUMAH" | "TANAH" | "RUKO" | "APARTEMEN";
  listingType: { forSale: boolean; forRent: boolean };
  priceSale: number | string;
  priceRent: number | string;
  rentPeriod: "TAHUNAN" | "BULANAN" | "HARIAN";
  images: string[];
  thumbnail: string | null;
  features: string[];
  details: Record<string, any>;
};

// Nilai awal untuk state form
const initialFormState: FormState = {
  title: "",
  description: "",
  location: "",
  category: undefined,
  listingType: { forSale: false, forRent: false },
  priceSale: "",
  priceRent: "",
  rentPeriod: "TAHUNAN",
  images: [],
  thumbnail: null,
  features: [],
  details: {},
};

export default function PropertyForm({
  initialData,
}: {
  initialData?: initialData;
}) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [featureInput, setFeatureInput] = useState("");
  const isEditMode = !!initialData;

  // [BARU] useEffect untuk mengisi form dalam mode edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        location: initialData.location || "",
        category: initialData.category,
        listingType: {
          forSale: !!initialData.forSaleListing,
          forRent: !!initialData.forRentListing,
        },
        priceSale: initialData.forSaleListing?.price || "",
        priceRent: initialData.forRentListing?.price || "",
        rentPeriod: initialData.forRentListing?.period || "TAHUNAN",
        images: initialData.images || [],
        thumbnail: initialData.thumbnail || null,
        features: initialData.features || [],
        details:
          initialData.houseDetails ||
          initialData.landDetails ||
          initialData.shophouseDetails ||
          initialData.apartmentDetails ||
          {},
      });
    }
  }, [initialData]);

  // Fungsi untuk validasi manual
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 10)
      newErrors.title = "Judul minimal 10 karakter.";
    if (!formData.description || formData.description.length < 20)
      newErrors.description = "Deskripsi minimal 20 karakter.";
    if (!formData.location) newErrors.location = "Lokasi wajib diisi.";
    if (!formData.category) newErrors.category = "Kategori wajib dipilih.";
    if (!formData.listingType.forSale && !formData.listingType.forRent)
      newErrors.listingType = "Pilih setidaknya satu jenis penawaran.";
    if (formData.listingType.forSale && !formData.priceSale)
      newErrors.priceSale = "Harga jual wajib diisi.";
    if (formData.listingType.forRent && !formData.priceRent)
      newErrors.priceRent = "Harga sewa wajib diisi.";
    if (formData.images.length === 0)
      newErrors.images = "Upload setidaknya satu gambar.";
    if (formData.images.length < 5)
      newErrors.images = "Upload minimal 5 gambar untuk hasil terbaik.";
    if (formData.features.length === 0)
      newErrors.features = "Tambahkan setidaknya satu fitur.";

    // Validasi spesifikasi (contoh untuk RUMAH)
    if (formData.category === "RUMAH") {
      if (!formData.details.luasBangunan)
        newErrors.luasBangunan = "Luas bangunan wajib diisi.";
      if (!formData.details.luasTanah)
        newErrors.luasTanah = "Luas tanah wajib diisi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true jika tidak ada error
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;

    // Pastikan tidak ada duplikat
    if (formData.features.includes(featureInput.trim())) {
      toast.warning("Fitur sudah ada.");
      return;
    }

    const newFeatures = [...formData.features, featureInput.trim()];
    handleInputChange("features", newFeatures);
    setFeatureInput(""); // Kosongkan input setelah ditambah
  };

  const removeFeature = (featureToRemove: string) => {
    const newFeatures = formData.features.filter((f) => f !== featureToRemove);
    handleInputChange("features", newFeatures);
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error(`Gagal mengupload ${file.name}`);
        return res.json();
      });

      const results = await Promise.all(uploadPromises);
      const newImages = results.map((r) => r.url).filter(Boolean);

      if (newImages.length > 0) {
        const updatedImages = [...formData.images, ...newImages];
        handleInputChange("images", updatedImages);
        // Set thumbnail otomatis jika belum ada
        if (!formData.thumbnail) {
          handleInputChange("thumbnail", updatedImages[0]);
        }
        toast.success(`${newImages.length} gambar berhasil diupload.`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat upload."
      );
    } finally {
      setUploading(false);
    }
  }

  function removeImage(imageToRemove: string) {
    const newImages = formData.images.filter((img) => img !== imageToRemove);
    handleInputChange("images", newImages);

    // Jika thumbnail yang dihapus, set thumbnail baru
    if (formData.thumbnail === imageToRemove) {
      handleInputChange("thumbnail", newImages[0] || null);
    }
    toast.info("Gambar dihapus.");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // [OPTIMASI] Tambahkan 'return' untuk menghentikan eksekusi jika validasi gagal
    if (!validateForm()) {
      toast.error("Form tidak valid. Silakan periksa kembali isian Anda.");
      return;
    }

    startTransition(async () => {
      const url = isEditMode
        ? `/api/properties/${initialData!.slug}` // Kita bisa pakai '!' karena isEditMode menjamin initialData ada
        : "/api/properties";
      const method = isEditMode ? "PUT" : "POST";

      const promise = fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      toast.promise(promise, {
        loading: `${isEditMode ? "Memperbarui" : "Menyimpan"} properti...`,
        success: async (res) => {
          // [PERBAIKAN] Tangani respons dari server
          if (!res.ok) {
            // Jika server memberikan status error (4xx atau 5xx)
            const errorData = await res.json();
            // Lemparkan error agar ditangkap oleh 'toast.error'
            throw new Error(
              errorData.error ||
                `Gagal ${isEditMode ? "memperbarui" : "membuat"} properti.`
            );
          }

          // Jika berhasil, ambil data dari respons
          const data = await res.json();

          // Tentukan URL tujuan berdasarkan mode
          const redirectUrl = isEditMode
            ? `/dashboard/properties/${initialData!.slug}` // Jika edit, kembali ke halaman detail yang sama
            : `/dashboard/properties/${data.slug}`; // Jika baru, pergi ke halaman detail yang baru dibuat

          // Lakukan redirect menggunakan window.location
          window.location.href = redirectUrl;

          // Kembalikan pesan sukses untuk notifikasi toast
          return `Properti berhasil ${isEditMode ? "diperbarui" : "dibuat"}!`;
        },
        error: (err) => err.message, // Ini akan menangkap error dari 'throw new Error' di atas
      });
    });
  };

  // Di dalam handleInputChange
  const handleInputChange = (field: keyof FormState, value: any) => {
    if (field === "priceSale" || field === "priceRent") {
      // Pastikan nilai yang disimpan adalah angka jika valid
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleDetailChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      details: { ...prev.details, [field]: value },
    }));
  };

  // Fungsi render spesifikasi yang sudah dilengkapi
  const renderSpecificationFields = () => {
    switch (formData.category) {
      case "RUMAH":
        return (
          <>
            <div className="space-y-2">
              <Label>Luas Bangunan (m²)</Label>
              <Input
                value={formData.details.luasBangunan || ""}
                onChange={(e) =>
                  handleDetailChange("luasBangunan", e.target.value)
                }
                type="number"
                placeholder="Contoh: 90"
              />
              {errors.luasBangunan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.luasBangunan}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Luas Tanah (m²)</Label>
              <Input
                value={formData.details.luasTanah || ""}
                onChange={(e) =>
                  handleDetailChange("luasTanah", e.target.value)
                }
                type="number"
                placeholder="Contoh: 124"
              />
              {errors.luasTanah && (
                <p className="text-red-500 text-sm mt-1">{errors.luasTanah}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Kamar Tidur</Label>
              <Input
                value={formData.details.kamarTidur || ""}
                onChange={(e) =>
                  handleDetailChange("kamarTidur", e.target.value)
                }
                type="number"
                placeholder="Contoh: 3"
              />
            </div>
            <div className="space-y-2">
              <Label>Kamar Mandi</Label>
              <Input
                value={formData.details.kamarMandi || ""}
                onChange={(e) =>
                  handleDetailChange("kamarMandi", e.target.value)
                }
                type="number"
                placeholder="Contoh: 2"
              />
            </div>
            <div className="space-y-2">
              <Label>Jumlah Lantai</Label>
              <Input
                value={formData.details.jumlahLantai || ""}
                onChange={(e) =>
                  handleDetailChange("jumlahLantai", e.target.value)
                }
                type="number"
                placeholder="Contoh: 2"
              />
            </div>
            <div className="space-y-2">
              <Label>Kapasitas Garasi (mobil)</Label>
              <Input
                value={formData.details.jumlahGarasi || ""}
                onChange={(e) =>
                  handleDetailChange("jumlahGarasi", e.target.value)
                }
                type="number"
                placeholder="Contoh: 1"
              />
            </div>
            <div className="space-y-2">
              <Label>Daya Listrik (watt)</Label>
              <Input
                value={formData.details.dayaListrik || ""}
                onChange={(e) =>
                  handleDetailChange("dayaListrik", e.target.value)
                }
                type="number"
                placeholder="Contoh: 2200"
              />
            </div>
            <div className="space-y-2">
              <Label>Sertifikat</Label>
              <Input
                value={formData.details.sertifikat || ""}
                onChange={(e) =>
                  handleDetailChange("sertifikat", e.target.value)
                }
                placeholder="Contoh: SHM"
              />
            </div>
          </>
        );
      case "TANAH":
        return (
          <>
            <div className="space-y-2">
              <Label>Luas Tanah (m²)</Label>
              <Input
                value={formData.details.luasTanah || ""}
                onChange={(e) =>
                  handleDetailChange("luasTanah", e.target.value)
                }
                type="number"
                placeholder="Contoh: 5000"
              />
              {errors.luasTanah && (
                <p className="text-red-500 text-sm mt-1">{errors.luasTanah}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Sertifikat</Label>
              <Input
                value={formData.details.sertifikat || ""}
                onChange={(e) =>
                  handleDetailChange("sertifikat", e.target.value)
                }
                placeholder="Contoh: SHM"
              />
            </div>
          </>
        );
      case "RUKO":
        return (
          <>
            <div className="space-y-2">
              <Label>Luas Bangunan (m²)</Label>
              <Input
                value={formData.details.luasBangunan || ""}
                onChange={(e) =>
                  handleDetailChange("luasBangunan", e.target.value)
                }
                type="number"
                placeholder="Contoh: 150"
              />
            </div>
            <div className="space-y-2">
              <Label>Luas Tanah (m²)</Label>
              <Input
                value={formData.details.luasTanah || ""}
                onChange={(e) =>
                  handleDetailChange("luasTanah", e.target.value)
                }
                type="number"
                placeholder="Contoh: 100"
              />
            </div>
            <div className="space-y-2">
              <Label>Jumlah Lantai</Label>
              <Input
                value={formData.details.jumlahLantai || ""}
                onChange={(e) =>
                  handleDetailChange("jumlahLantai", e.target.value)
                }
                type="number"
                placeholder="Contoh: 3"
              />
            </div>
            <div className="space-y-2">
              <Label>Kamar Mandi</Label>
              <Input
                value={formData.details.kamarMandi || ""}
                onChange={(e) =>
                  handleDetailChange("kamarMandi", e.target.value)
                }
                type="number"
                placeholder="Contoh: 3"
              />
            </div>
            <div className="space-y-2">
              <Label>Kapasitas Parkir (mobil)</Label>
              <Input
                value={formData.details.areaParkir || ""}
                onChange={(e) =>
                  handleDetailChange("areaParkir", e.target.value)
                }
                type="number"
                placeholder="Contoh: 5"
              />
            </div>
            <div className="space-y-2">
              <Label>Daya Listrik (watt)</Label>
              <Input
                value={formData.details.dayaListrik || ""}
                onChange={(e) =>
                  handleDetailChange("dayaListrik", e.target.value)
                }
                type="number"
                placeholder="Contoh: 5500"
              />
            </div>
            <div className="space-y-2">
              <Label>Sertifikat</Label>
              <Input
                value={formData.details.sertifikat || ""}
                onChange={(e) =>
                  handleDetailChange("sertifikat", e.target.value)
                }
                placeholder="Contoh: HGB"
              />
            </div>
          </>
        );
      case "APARTEMEN":
        return (
          <>
            <div className="space-y-2">
              <Label>Luas Unit (m²)</Label>
              <Input
                value={formData.details.luasBangunan || ""}
                onChange={(e) =>
                  handleDetailChange("luasBangunan", e.target.value)
                }
                type="number"
                placeholder="Contoh: 45"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipe Unit</Label>
              <Input
                value={formData.details.tipeUnit || ""}
                onChange={(e) => handleDetailChange("tipeUnit", e.target.value)}
                placeholder="Contoh: 2BR"
              />
            </div>
            <div className="space-y-2">
              <Label>Kamar Tidur</Label>
              <Input
                value={formData.details.kamarTidur || ""}
                onChange={(e) =>
                  handleDetailChange("kamarTidur", e.target.value)
                }
                type="number"
                placeholder="Contoh: 2"
              />
            </div>
            <div className="space-y-2">
              <Label>Kamar Mandi</Label>
              <Input
                value={formData.details.kamarMandi || ""}
                onChange={(e) =>
                  handleDetailChange("kamarMandi", e.target.value)
                }
                type="number"
                placeholder="Contoh: 1"
              />
            </div>
            <div className="space-y-2">
              <Label>Lantai Ke-</Label>
              <Input
                value={formData.details.lantaiKe || ""}
                onChange={(e) => handleDetailChange("lantaiKe", e.target.value)}
                type="number"
                placeholder="Contoh: 12"
              />
            </div>
            <div className="space-y-2">
              <Label>Daya Listrik (watt)</Label>
              <Input
                value={formData.details.dayaListrik || ""}
                onChange={(e) =>
                  handleDetailChange("dayaListrik", e.target.value)
                }
                type="number"
                placeholder="Contoh: 3500"
              />
            </div>
            <div className="space-y-2">
              <Label>Sertifikat</Label>
              <Input
                value={formData.details.sertifikat || ""}
                onChange={(e) =>
                  handleDetailChange("sertifikat", e.target.value)
                }
                placeholder="Contoh: HGB Murni / Strata Title"
              />
            </div>
          </>
        );
      default:
        return (
          <p className="text-sm text-muted-foreground col-span-full">
            Pilih kategori untuk melihat field spesifikasi yang relevan.
          </p>
        );
    }
  };
  console.log("Current category in state:", formData.category);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* KARTU INFORMASI DASAR */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
          <CardDescription>
            Mulai dengan detail utama properti Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Iklan</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              onValueChange={(value) => {
                handleInputChange("category", value);
                console.log(value);
              }}
              value={formData.category}
              key={formData.category || "placeholder"} // Reset internal state jika category di-reset
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori properti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RUMAH">Rumah</SelectItem>
                <SelectItem value="TANAH">Tanah</SelectItem>
                <SelectItem value="RUKO">Ruko</SelectItem>
                <SelectItem value="APARTEMEN">Apartemen</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KARTU SPESIFIKASI */}
      <Card>
        <CardHeader>
          <CardTitle>Spesifikasi Properti</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSpecificationFields()}
        </CardContent>
      </Card>

      {/* KARTU PENAWARAN & HARGA */}
      <Card>
        <CardHeader>
          <CardTitle>Penawaran & Harga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="forSale"
                checked={formData.listingType.forSale}
                onCheckedChange={(checked) =>
                  handleInputChange("listingType", {
                    ...formData.listingType,
                    forSale: !!checked,
                  })
                }
              />
              <Label htmlFor="forSale">Dijual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="forRent"
                checked={formData.listingType.forRent}
                onCheckedChange={(checked) =>
                  handleInputChange("listingType", {
                    ...formData.listingType,
                    forRent: !!checked,
                  })
                }
              />
              <Label htmlFor="forRent">Disewa</Label>
            </div>
          </div>
          {errors.listingType && (
            <p className="text-red-500 text-sm mt-1">{errors.listingType}</p>
          )}

          {formData.listingType.forSale && (
            <div className="space-y-2">
              <Label htmlFor="priceSale">Harga Jual (Rp)</Label>
              <Input
                id="priceSale"
                value={formData.priceSale}
                onChange={(e) => handleInputChange("priceSale", e.target.value)}
                type="number"
              />
              {errors.priceSale && (
                <p className="text-red-500 text-sm mt-1">{errors.priceSale}</p>
              )}
            </div>
          )}
          {formData.listingType.forRent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceRent">Harga Sewa (Rp)</Label>
                <Input
                  id="priceRent"
                  value={formData.priceRent}
                  onChange={(e) =>
                    handleInputChange("priceRent", e.target.value)
                  }
                  type="number"
                />
                {errors.priceRent && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.priceRent}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Periode Sewa</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("rentPeriod", value)
                  }
                  value={formData.rentPeriod}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TAHUNAN">Tahunan</SelectItem>
                    <SelectItem value="BULANAN">Bulanan</SelectItem>
                    <SelectItem value="HARIAN">Harian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ... Kartu untuk Gambar dan Fitur ... */}
      {/* KARTU GAMBAR & FITUR */}
      <Card>
        <CardHeader>
          <CardTitle>Media & Fitur Tambahan</CardTitle>
          <CardDescription>
            Upload gambar properti dan tambahkan fitur-fitur unggulan yang
            dimiliki.
          </CardDescription>
        </CardHeader>
        <Separator className="h-px bg-gray-300 w-full" />
        <CardContent className="space-y-8">
          {/* Bagian Upload Gambar */}
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="font-semibold">
              Gambar Properti
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Gambar pertama yang di-upload akan menjadi thumbnail otomatis.
              Anda bisa mengubahnya nanti.
            </p>
            <Input
              id="image-upload"
              type="file"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              className="mb-2"
            />
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}

            {/* Tampilan preview gambar dan skeleton loader */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4 min-h-[100px]">
              {formData.images.map((img) => (
                <div key={img} className="relative group aspect-square">
                  <Image
                    src={img}
                    width={200}
                    height={200}
                    alt="Preview Properti"
                    className={`w-full h-full object-cover rounded-md border-2 transition-all ${
                      formData.thumbnail === img
                        ? "border-green-500 scale-105"
                        : "border-transparent"
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => handleInputChange("thumbnail", img)}
                    >
                      {formData.thumbnail === img
                        ? "✓ Thumbnail"
                        : "Set Thumbnail"}
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7"
                      onClick={() => removeImage(img)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
              {/* Indikator Loading Skeleton */}
              {uploading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-md animate-pulse"
                  ></div>
                ))}
            </div>
          </div>

          {/* Bagian Fitur */}
          <div className="space-y-2">
            <Label className="font-semibold">Fitur & Fasilitas</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Tekan 'Enter' atau klik 'Tambah' untuk menambahkan fitur.
            </p>
            <div className="flex gap-2 mb-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="e.g. Kolam Renang, Keamanan 24 Jam"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addFeature}>
                Tambah
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md border min-h-[40px]">
              {formData.features.map((feature, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeFeature(feature)}
                >
                  {feature} &times;
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending
          ? "Menyimpan..."
          : isEditMode
          ? "Simpan Perubahan"
          : "Publikasikan Properti"}
      </Button>
    </form>
  );
}
