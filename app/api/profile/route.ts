import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Mengambil data profil user yang sedang login
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Tidak terautentikasi." },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

// PUT: Memperbarui data profil atau kata sandi
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Tidak terautentikasi." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    // --- Logika untuk update profil ---
    if (name || email) {
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: name || user.name,
          email: email || user.email,
        },
      });
      return NextResponse.json({ message: "Profil berhasil diperbarui." });
    }

    // --- Logika untuk update kata sandi ---
    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Kata sandi baru minimal 6 karakter." },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Kata sandi saat ini salah." },
          { status: 403 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
      });

      return NextResponse.json({ message: "Kata sandi berhasil diubah." });
    }

    return NextResponse.json(
      { error: "Tidak ada data untuk diperbarui." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Gagal update profil:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
