// File: components/TitipJualSection.tsx

import Link from "next/link";
import { Button } from "./ui/button";

export default function TitipJualSection() {
  return (
    <div className="bg-teal-800 text-white">
      <div className="container py-12 text-center">
        <h2 className="text-3xl font-bold">
          Punya Properti untuk Dijual atau Disewa?
        </h2>
        <p className="mt-2 max-w-2xl mx-auto text-teal-100">
          Biarkan tim profesional kami membantu memasarkannya. Proses cepat dan
          transparan.
        </p>
        <div className="mt-6">
          <Link href="/titip-jual">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-teal-900 font-bold"
            >
              Titipkan Properti Anda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
