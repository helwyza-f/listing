import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` akan memperkaya `req` dengan `token`
  function middleware(req) {
    // Cek apakah token ada DAN rolenya adalah ADMIN
    // console.log(req.nextauth.token);
    if (
      req.nextUrl.pathname.startsWith("/dashboard") &&
      req.nextauth.token?.role === "USER"
    ) {
      // Jika bukan ADMIN, redirect ke halaman "Akses Ditolak" atau homepage
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      // Callback ini menentukan apakah pengguna diizinkan masuk
      authorized: ({ token }) => !!token, // Cukup cek apakah token ada (sudah login)
    },
  }
);

// Terapkan middleware ke semua rute di bawah /dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};
