// File: components/PublicFooter.tsx

import Link from "next/link";
import { Building } from "lucide-react";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 text-slate-600 px-4">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Kolom 1: Logo & Deskripsi */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-2">
              <Building className="h-6 w-6 mr-2 text-teal-700" />
              <span className="text-xl font-bold text-slate-800">
                Batam Properties
              </span>
            </div>
            <p className="text-sm">
              Portal properti terlengkap dan terpercaya di Batam. Temukan rumah,
              ruko, tanah, dan apartemen impian Anda bersama kami.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Jelajahi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dijual" className="hover:text-slate-900">
                  Properti Dijual
                </Link>
              </li>
              <li>
                <Link href="/disewa" className="hover:text-slate-900">
                  Properti Disewa
                </Link>
              </li>
              <li>
                <Link href="/titip-jual" className="hover:text-slate-900">
                  Titip Jual Properti
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Hubungi Kami */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Hubungi Kami</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: halo@batamproperties.org</li>
              <li>Telepon: (0778) 555-1234</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs">
          <p>&copy; {currentYear} Batam Properties. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
