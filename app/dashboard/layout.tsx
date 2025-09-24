"use client"; // Diperlukan untuk hook seperti usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building,
  Settings,
  UserCircle,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Utilitas dari Shadcn UI

// Komponen kecil untuk link di sidebar agar lebih rapi
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
  const isActive = pathname === href;

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar (Navigasi Utama) */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-background">
        <div className="flex flex-col flex-grow p-4">
          {/* Logo atau Judul Dashboard */}
          <div className="h-16 flex items-center px-3 mb-4">
            <Home className="w-6 h-6 mr-3" />
            <h1 className="text-xl font-bold">Dasbor Properti</h1>
          </div>

          {/* Grup Navigasi */}
          <nav className="flex-1 space-y-2">
            <SidebarLink href="/dashboard" icon={LayoutDashboard}>
              Beranda
            </SidebarLink>
            <SidebarLink href="/dashboard/properties" icon={Building}>
              Properti
            </SidebarLink>
            <SidebarLink href="/dashboard/settings" icon={Settings}>
              Pengaturan
            </SidebarLink>
          </nav>

          {/* Bagian Bawah Sidebar (User/Logout) */}
          <div className="mt-auto">
            <div className="border-t pt-4 space-y-2">
              <SidebarLink href="/dashboard/profile" icon={UserCircle}>
                Profil Saya
              </SidebarLink>
              <button className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors text-red-500 hover:bg-red-50">
                <LogOut className="w-5 h-5 mr-3" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-4 sm:p-2 lg:p-2">
        {children} {/* Di sinilah semua page.tsx Anda akan di-render */}
      </main>
    </div>
  );
}
