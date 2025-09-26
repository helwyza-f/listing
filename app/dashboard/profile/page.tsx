"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Komponen untuk Form Informasi Profil
function ProfileInfoForm({
  initialData,
  onMutate,
}: {
  initialData: any;
  onMutate: () => void;
}) {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const promise = fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    toast.promise(promise, {
      loading: "Memperbarui profil...",
      success: async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error);
        }
        onMutate(); // Revalidasi data SWR
        return "Profil berhasil diperbarui!";
      },
      error: (err) => err.message,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit">Simpan Perubahan</Button>
    </form>
  );
}

// Komponen untuk Form Ubah Kata Sandi
function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    const promise = fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    toast.promise(promise, {
      loading: "Mengubah kata sandi...",
      success: async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error);
        }
        // Kosongkan field setelah berhasil
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        return "Kata sandi berhasil diubah!";
      },
      error: (err) => err.message,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="newPassword">Kata Sandi Baru</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <Button type="submit">Ubah Kata Sandi</Button>
    </form>
  );
}

// Komponen Halaman Utama
export default function ProfilePage() {
  const { data, error, isLoading, mutate } = useSWR("/api/profile", fetcher);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (error) return <div>Gagal memuat profil.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground">
          Kelola informasi akun dan kata sandi Anda di sini.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>
              Perbarui nama dan alamat email Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileInfoForm initialData={data} onMutate={mutate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ubah Kata Sandi</CardTitle>
            <CardDescription>
              Pastikan Anda menggunakan kata sandi yang kuat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
