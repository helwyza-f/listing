"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseInt(form.price),
      }),
    });
    router.push("/dashboard/properties");
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-bold mb-4">Tambah Properti</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Judul"
          className="w-full border px-3 py-2"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Deskripsi"
          className="w-full border px-3 py-2"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Harga"
          className="w-full border px-3 py-2"
          value={form.price}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Lokasi"
          className="w-full border px-3 py-2"
          value={form.location}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
