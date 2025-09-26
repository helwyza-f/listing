import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 1. Validasi input dasar
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Data tidak lengkap." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    // 2. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar." },
        { status: 409 }
      ); // 409 Conflict
    }

    // 3. Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Buat user baru di database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Role akan default ke "USER" sesuai skema Prisma Anda
      },
    });

    // Jangan kirim kembali password, bahkan yang sudah di-hash
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("Gagal mendaftar:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
