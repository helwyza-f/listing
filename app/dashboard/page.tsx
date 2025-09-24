import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, PlusCircle, Activity } from "lucide-react";
import Link from "next/link";

export default function DashboardHomePage() {
  // Di sini Anda bisa mengambil data ringkasan, misalnya:
  const totalProperties = 12; // Contoh data
  const newLeads = 3; // Contoh data

  return (
    <div className="space-y-6 md:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Selamat Datang Kembali!
        </h1>
        <p className="text-muted-foreground">
          Berikut adalah ringkasan aktivitas properti Anda.
        </p>
      </div>

      {/* Kartu Ringkasan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properti
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">properti terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prospek Baru</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{newLeads}</div>
            <p className="text-xs text-muted-foreground">
              dalam 7 hari terakhir
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tombol Aksi Cepat */}
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/properties/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Properti Baru
          </Button>
        </Link>
      </div>
    </div>
  );
}
