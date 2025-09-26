// app/api/properties/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan path prisma client Anda benar
import slugify from "slugify";

// GET: Mengambil semua properti
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("lokasi");
    const category = searchParams.get("kategori");
    const priceMin = searchParams.get("hargaMin");
    const priceMax = searchParams.get("hargaMax");
    const sortBy = searchParams.get("urutkan") || "updatedAt_desc";

    const where: any = {
      category: {
        in: ["RUMAH", "TANAH", "RUKO", "APARTEMEN"],
      },
      // [PERBAIKAN] Sintaks yang benar untuk filter relasi
      forSaleListing: {
        isActive: true,
      },
    };

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }
    if (category) {
      where.category = category;
    }
    if (priceMin) {
      const min = parseInt(priceMin, 10);
      if (!isNaN(min)) {
        where.forSaleListing.price = {
          ...where.forSaleListing.price,
          gte: min,
        };
      }
    }
    if (priceMax) {
      const max = parseInt(priceMax, 10);
      if (!isNaN(max)) {
        where.forSaleListing.price = {
          ...where.forSaleListing.price,
          lte: max,
        };
      }
    }

    let orderBy: any = {};
    if (sortBy === "harga_asc") {
      orderBy = { forSaleListing: { price: "asc" } };
    } else if (sortBy === "harga_desc") {
      orderBy = { forSaleListing: { price: "desc" } };
    } else {
      orderBy = { updatedAt: "desc" };
    }
    console.log(where);
    const properties = await prisma.property.findMany({
      where,
      orderBy,
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
      { error: "Terjadi kesalahan pada server." },
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
          data: { price: Number(priceSale), propertyId: property.id }, // <-- Gunakan Number()
        });
      }

      if (listingType.forRent && priceRent) {
        await tx.forRentListing.create({
          data: {
            price: Number(priceRent),
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
