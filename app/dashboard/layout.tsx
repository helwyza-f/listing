"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; // [BARU] Impor untuk sesi & logout
import {
  Home,
  Building,
  Settings,
  UserCircle,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"; // [BARU] Impor untuk loading state

// Komponen SidebarLink (tidak ada perubahan)
function SidebarLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href}>
      <span
        className={cn(
          "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="w-5 h-5 mr-3" />
        {children}
      </span>
    </Link>
  );
}

// [BARU] Komponen untuk menampilkan profil pengguna
function UserProfile() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="border-t pt-4">
      <div className="flex items-center gap-3 px-3 py-2 mb-2">
        <UserCircle className="w-10 h-10 text-muted-foreground" />
        <div className="flex flex-col">
          <p className="text-sm font-semibold">{session.user.name}</p>
          <p className="text-xs text-muted-foreground">{session.user.email}</p>
        </div>
      </div>
      <div className="space-y-1">
        <SidebarLink href="/dashboard/profile" icon={Settings}>
          Profil Saya
        </SidebarLink>
        <button
          onClick={() => signOut({ callbackUrl: "/" })} // Arahkan ke homepage setelah logout
          className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors text-red-500 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Keluar
        </button>
      </div>
    </div>
  );
}

// [BARU] Komponen untuk loading state profil
function UserProfileSkeleton() {
  return (
    <div className="border-t pt-4">
      <div className="flex items-center gap-3 px-3 py-2 mb-2">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="space-y-1">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // [BARU] Ambil status sesi
  const { status } = useSession();

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-background">
        <div className="flex flex-col flex-grow p-4">
          <div className="h-16 flex items-center px-3 mb-4">
            <Home className="w-6 h-6 mr-3" />
            <h1 className="text-xl font-bold">Dasbor Properti</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarLink href="/dashboard" icon={LayoutDashboard}>
              Beranda
            </SidebarLink>
            <SidebarLink href="/dashboard/properties" icon={Building}>
              Properti
            </SidebarLink>
            {/* <SidebarLink href="/dashboard/settings" icon={Settings}>Pengaturan</SidebarLink> */}
          </nav>

          {/* [PERBAIKAN] Bagian bawah sidebar sekarang dinamis */}
          <div className="mt-auto">
            {status === "loading" && <UserProfileSkeleton />}
            {status === "authenticated" && <UserProfile />}
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
