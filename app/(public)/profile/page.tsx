import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function UserProfilePage() {
  // Lindungi halaman ini di sisi server
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
          <p className="text-muted-foreground">
            Lihat dan kelola informasi akun Anda di sini.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Selamat Datang, {session.user?.name}!</CardTitle>
            <CardDescription>
              Ini adalah halaman profil Anda. Fitur lebih lanjut akan segera
              hadir!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Email: {session.user?.email}</p>
            <p>Role: {session.user?.role}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
