import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-600 mt-2">Selamat datang di panel admin.</p>
      <div className="mt-6">
        <Link
          href="/dashboard/properties"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Kelola Properti
        </Link>
        <Link href={"/"}>Home</Link>
        <Link href={"/dashboard/properties"}>Prop</Link>
      </div>
    </div>
  );
}
