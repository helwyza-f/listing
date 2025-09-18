import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <Link href="/dashboard">
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mt-4">Property Listing</h1>
        <p className="mt-2 text-gray-600">
          Klik di mana saja untuk masuk ke panel admin
        </p>
      </div>
    </Link>
  );
}
