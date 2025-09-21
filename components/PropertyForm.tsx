// src/components/PropertyForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "@/components/RichTextEditor";
import Image from "next/image";

// Definisikan tipe untuk data properti agar lebih aman
type PropertyData = {
  slug?: string;
  title: string;
  description: string;
  price: string;
  location: string;
  features: string[];
  images: string[];
  thumbnail?: string | null;
};

// Definisikan props untuk komponen
interface PropertyFormProps {
  initialData?: PropertyData;
}

export default function PropertyForm({ initialData }: PropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Tentukan apakah ini mode edit atau buat baru
  const isEditMode = !!initialData;

  const [form, setForm] = useState<PropertyData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    location: initialData?.location || "",
    features: initialData?.features || [],
    images: initialData?.images || [],
    thumbnail: initialData?.thumbnail || "",
  });

  const [featureInput, setFeatureInput] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        uploaded.push(data.url);
      }
    }

    setUploading(false);

    if (uploaded.length > 0) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
        // Set gambar pertama sebagai thumbnail jika thumbnail belum ada
        thumbnail: prev.thumbnail || uploaded[0],
      }));
    }
  }

  function addFeature() {
    if (!featureInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, featureInput.trim()],
    }));
    setFeatureInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Tentukan URL dan method berdasarkan mode (edit atau baru)
    const apiUrl = isEditMode
      ? `/api/properties/${initialData?.slug}`
      : "/api/properties";
    const apiMethod = isEditMode ? "PUT" : "POST";

    await fetch(apiUrl, {
      method: apiMethod,
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    startTransition(() => {
      // Refresh router untuk melihat perubahan dan redirect
      router.refresh();
      router.push("/dashboard/properties");
    });
  }

  // Fungsi untuk menghapus fitur
  function removeFeature(featureToRemove: string) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== featureToRemove),
    }));
  }

  // Fungsi untuk menghapus gambar
  function removeImage(imageToRemove: string) {
    setForm((prev) => {
      const newImages = prev.images.filter((img) => img !== imageToRemove);
      // Jika thumbnail yang dihapus, set thumbnail ke gambar pertama atau kosong
      const newThumbnail =
        prev.thumbnail === imageToRemove ? newImages[0] || "" : prev.thumbnail;

      return {
        ...prev,
        images: newImages,
        thumbnail: newThumbnail,
      };
    });
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Properti" : "Tambah Properti Baru"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title, Deskripsi, Harga, Lokasi tetap sama... */}

        {/* Judul */}
        <div>
          <Label htmlFor="title">Judul Properti</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* Deskripsi */}
        <div>
          <Label>Deskripsi</Label>
          <RichTextEditor
            value={form.description}
            onChange={(value) => setForm({ ...form, description: value })}
          />
        </div>

        {/* Harga */}
        <div>
          <Label htmlFor="price">Harga</Label>
          <Input
            id="price"
            type="text"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>

        {/* Lokasi */}
        <div>
          <Label htmlFor="location">Lokasi</Label>
          <Input
            id="location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
        </div>

        {/* Fitur */}
        <div>
          <Label>Fitur</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="e.g. Kolam Renang"
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
          <div className="flex flex-wrap gap-2">
            {form.features.map((f, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeFeature(f)}
              >
                {f} &times;
              </Badge>
            ))}
          </div>
        </div>

        {/* Upload Gambar */}
        <div>
          <Label htmlFor="image-upload">Upload Gambar</Label>
          <Input
            id="image-upload"
            type="file"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
            {form.images.map((img, i) => (
              <div key={i} className="relative group aspect-square">
                <Image
                  src={img}
                  alt={`Preview ${i + 1}`}
                  className={`w-full h-full object-cover rounded-md border-2 ${
                    form.thumbnail === img
                      ? "border-green-500"
                      : "border-transparent"
                  }`}
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, thumbnail: img }))
                    }
                    className="text-xs text-white p-1 rounded"
                  >
                    {form.thumbnail === img ? "Thumbnail ✔" : "Set Thumbnail"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending || uploading}
          className="w-full"
        >
          {isPending
            ? "Menyimpan..."
            : isEditMode
            ? "Simpan Perubahan"
            : "Simpan Properti"}
        </Button>
      </form>
    </main>
  );
}
