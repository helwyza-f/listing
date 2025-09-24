import {
  Bath,
  BedDouble,
  Building,
  Building2,
  Car,
  FileText,
  Home,
  LandPlot,
  ParkingSquare,
  Square,
  Zap,
} from "lucide-react";
import { FullProperty } from "../../lib/types";

// Komponen kecil untuk menampilkan satu baris spesifikasi
function SpecItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: any;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center text-sm">
      <Icon className="w-4 h-4 mr-3 text-muted-foreground" />
      <span className="font-medium w-36">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

export const renderSpecifications = (property: FullProperty) => {
  switch (property.category) {
    case "RUMAH":
      const house = property.houseDetails;
      // [FIX] Tambahkan pengecekan ini untuk memastikan data ada
      if (!house)
        return <p>Data spesifikasi untuk rumah ini tidak ditemukan.</p>;

      return (
        <>
          <SpecItem
            icon={Building}
            label="Luas Bangunan"
            value={`${house.luasBangunan} m²`}
          />
          <SpecItem
            icon={Square}
            label="Luas Tanah"
            value={`${house.luasTanah} m²`}
          />
          <SpecItem
            icon={BedDouble}
            label="Kamar Tidur"
            value={house.kamarTidur}
          />
          <SpecItem icon={Bath} label="Kamar Mandi" value={house.kamarMandi} />
          <SpecItem
            icon={Home}
            label="Jumlah Lantai"
            value={house.jumlahLantai}
          />
          <SpecItem
            icon={Car}
            label="Garasi"
            value={`${house.jumlahGarasi} mobil`}
          />
          <SpecItem
            icon={Zap}
            label="Daya Listrik"
            value={`${house.dayaListrik} Watt`}
          />
          <SpecItem
            icon={FileText}
            label="Sertifikat"
            value={house.sertifikat}
          />
        </>
      );

    case "TANAH":
      const land = property.landDetails;
      // [FIX] Tambahkan pengecekan ini
      if (!land)
        return <p>Data spesifikasi untuk tanah ini tidak ditemukan.</p>;

      return (
        <>
          <SpecItem
            icon={LandPlot}
            label="Luas Tanah"
            value={`${land.luasTanah} m²`}
          />
          <SpecItem
            icon={FileText}
            label="Sertifikat"
            value={land.sertifikat}
          />
        </>
      );

    case "RUKO":
      const shophouse = property.shophouseDetails;
      // [FIX] Tambahkan pengecekan ini
      if (!shophouse)
        return <p>Data spesifikasi untuk ruko ini tidak ditemukan.</p>;

      return (
        <>
          <SpecItem
            icon={Building}
            label="Luas Bangunan"
            value={`${shophouse.luasBangunan} m²`}
          />
          <SpecItem
            icon={Square}
            label="Luas Tanah"
            value={`${shophouse.luasTanah} m²`}
          />
          <SpecItem
            icon={Home}
            label="Jumlah Lantai"
            value={shophouse.jumlahLantai}
          />
          <SpecItem
            icon={Bath}
            label="Kamar Mandi"
            value={shophouse.kamarMandi}
          />
          <SpecItem
            icon={ParkingSquare}
            label="Area Parkir"
            value={`${shophouse.areaParkir} mobil`}
          />
          <SpecItem
            icon={Zap}
            label="Daya Listrik"
            value={`${shophouse.dayaListrik} Watt`}
          />
          <SpecItem
            icon={FileText}
            label="Sertifikat"
            value={shophouse.sertifikat}
          />
        </>
      );

    case "APARTEMEN":
      const apartment = property.apartmentDetails;
      // [FIX] Tambahkan pengecekan ini
      if (!apartment)
        return <p>Data spesifikasi untuk apartemen ini tidak ditemukan.</p>;

      return (
        <>
          <SpecItem
            icon={Building2}
            label="Tipe Unit"
            value={apartment.tipeUnit}
          />
          <SpecItem
            icon={Building}
            label="Luas Unit"
            value={`${apartment.luasBangunan} m²`}
          />
          <SpecItem
            icon={BedDouble}
            label="Kamar Tidur"
            value={apartment.kamarTidur}
          />
          <SpecItem
            icon={Bath}
            label="Kamar Mandi"
            value={apartment.kamarMandi}
          />
          <SpecItem icon={Home} label="Lantai Ke" value={apartment.lantaiKe} />
          <SpecItem
            icon={Zap}
            label="Daya Listrik"
            value={`${apartment.dayaListrik} Watt`}
          />
          <SpecItem
            icon={FileText}
            label="Sertifikat"
            value={apartment.sertifikat}
          />
        </>
      );

    default:
      return <p>Spesifikasi tidak tersedia untuk kategori ini.</p>;
  }
};
