// File: components/PublicNavbar.tsx

"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Building, Send } from "lucide-react"; // Menggunakan ikon Building
import UserNav from "./UserNav";
import { Skeleton } from "./ui/skeleton";

export default function PublicNavbar() {
  const { status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="container flex h-16 items-center">
        {/* [BRANDING] Logo & Nama Baru */}
        <div className="mr-6 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-teal-700" />{" "}
            {/* Warna primary brand */}
            <span className="font-bold text-lg">Batam Properties</span>
          </Link>
        </div>

        {/* Navigasi Utama */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/dijual"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Dijual
          </Link>
          <Link
            href="/disewa"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Disewa
          </Link>
          <Link
            href="/agen"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Cari Agen
          </Link>
        </nav>

        {/* Tombol Aksi di Kanan */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* [BRANDING] Tombol CTA Titip Jual */}
          <Link href="/titip-jual" className="hidden sm:inline-flex">
            <Button
              variant="outline"
              className="text-teal-700 border-teal-700 hover:bg-teal-50 hover:text-teal-800"
            >
              <Send className="w-4 h-4 mr-2" /> Titip Jual
            </Button>
          </Link>

          {status === "loading" && (
            <Skeleton className="h-9 w-9 rounded-full" />
          )}

          {status === "authenticated" && <UserNav />}

          {status === "unauthenticated" && (
            <>
              <Link href="/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
              <Link href="/register">
                {/* [BRANDING] Warna tombol aksen */}
                <Button className="bg-amber-500 hover:bg-amber-600 text-teal-900">
                  Daftar
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
