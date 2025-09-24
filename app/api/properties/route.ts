import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan path prisma client Anda benar
import slugify from "slugify";

// GET: Mengambil semua properti (tetap sama)
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { updatedAt: "desc" },
      // [PERBAIKAN] Tambahkan 'where' untuk memfilter data yang tidak valid
      where: {
        category: {
          // Hanya ambil properti yang kategorinya salah satu dari enum
          in: ["RUMAH", "TANAH", "RUKO", "APARTEMEN"],
        },
      },
      include: {
        forSaleListing: true,
        forRentListing: true,
        houseDetails: true,
        landDetails: true,
        shophouseDetails: true,
        apartmentDetails: true,
      },
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Gagal mengambil data properti:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat mengambil data." },
      { status: 500 }
    );
  }
}

// POST: Membuat properti baru (SUDAH DIPERBAIKI)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      location,
      category,
      listingType,
      priceSale,
      priceRent,
      rentPeriod,
      images,
      thumbnail,
      features,
      details, // ini adalah objek dengan nilai string
    } = body;

    if (!title || !category || !location) {
      return NextResponse.json(
        { error: "Data wajib tidak lengkap." },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.property.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // [PERBAIKAN 1] Mengonversi nilai string dari 'details' menjadi angka
    const parsedDetails = Object.entries(details).reduce(
      (acc, [key, value]) => {
        // Hanya parse jika nilainya ada dan merupakan tipe data yang seharusnya angka
        const numericFields = [
          "luasBangunan",
          "luasTanah",
          "kamarTidur",
          "kamarMandi",
          "jumlahLantai",
          "jumlahGarasi",
          "dayaListrik",
          "areaParkir",
          "lantaiKe",
        ];
        if (
          numericFields.includes(key) &&
          typeof value === "string" &&
          value.trim() !== ""
        ) {
          acc[key] = parseInt(value, 10);
        } else {
          acc[key] = value; // Biarkan seperti sertifikat (string)
        }
        return acc;
      },
      {} as any
    );

    const newProperty = await prisma.$transaction(async (tx) => {
      const property = await tx.property.create({
        data: {
          title,
          slug: uniqueSlug,
          description,
          location,
          category,
          images,
          thumbnail: thumbnail || images[0] || null,
          // [PERBAIKAN 2] Langsung gunakan array 'features' karena formatnya sudah benar
          features: features || [],
        },
      });

      switch (category) {
        case "RUMAH":
          await tx.houseDetails.create({
            data: { ...parsedDetails, propertyId: property.id },
          });
          break;
        case "TANAH":
          await tx.landDetails.create({
            data: { ...parsedDetails, propertyId: property.id },
          });
          break;
        case "RUKO":
          await tx.shophouseDetails.create({
            data: { ...parsedDetails, propertyId: property.id },
          });
          break;
        case "APARTEMEN":
          await tx.apartmentDetails.create({
            data: { ...parsedDetails, propertyId: property.id },
          });
          break;
        default:
          throw new Error("Kategori properti tidak valid.");
      }

      if (listingType.forSale && priceSale) {
        await tx.forSaleListing.create({
          data: { price: priceSale, propertyId: property.id },
        });
      }

      if (listingType.forRent && priceRent) {
        await tx.forRentListing.create({
          data: {
            price: priceRent,
            period: rentPeriod,
            propertyId: property.id,
          },
        });
      }

      return property;
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error: any) {
    console.error("Gagal membuat properti:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat membuat properti." },
      { status: 500 }
    );
  }
}
