import { Card, CardContent } from "@/components/ui/card";
import { FullProperty } from "@/lib/types";
import { Bath, BedDouble, LandPlot, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";

function SpecIcon({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value?: string | number | null;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center text-xs text-gray-600">
      <Icon className="w-4 h-4 mr-1 flex-shrink-0" />
      <span>{value}</span>
    </div>
  );
}

export default function PublicPropertyCard({
  property,
}: {
  property: FullProperty;
}) {
  const formatPrice = (price?: number | null) => {
    if (!price) return "N/A";
    const num = price;
    if (isNaN(num)) return "N/A";

    if (num >= 1_000_000_000)
      return `${(num / 1_000_000_000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
      })} M`;
    if (num >= 1_000_000)
      return `${(num / 1_000_000).toLocaleString("id-ID", {
        maximumFractionDigits: 0,
      })} Jt`;
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const renderSpecs = () => {
    switch (property.category) {
      case "RUMAH":
        const h = property.houseDetails;
        return (
          <>
            {h && (
              <>
                <SpecIcon icon={BedDouble} value={h.kamarTidur} />
                <SpecIcon icon={Bath} value={h.kamarMandi} />
                <SpecIcon icon={LandPlot} value={`${h.luasTanah} m²`} />
              </>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Link href={`/properti/${property.slug}`}>
      <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col group h-full">
        <div className="relative">
          <Image
            src={
              property.thumbnail ||
              property.images?.[0] ||
              "https://placehold.co/400x300?text=No+Image"
            }
            alt={property.title}
            width={400}
            height={300}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 capitalize"
          >
            {property.category.toLowerCase()}
          </Badge>
        </div>
        <CardContent className="p-3 flex flex-col flex-grow">
          <div className="flex items-center space-x-3 mb-2 pb-2 border-b">
            {renderSpecs()}
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-base leading-snug line-clamp-2">
              {property.title}
            </h3>
            <p className="text-xs text-gray-500 flex items-center pt-1">
              <MapPin size={12} className="mr-1 flex-shrink-0" />{" "}
              {property.location}
            </p>
          </div>
          <div className="mt-3">
            <p className="text-lg font-bold text-teal-800">
              Rp {formatPrice(property.forSaleListing?.price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
