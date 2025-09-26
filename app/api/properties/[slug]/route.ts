import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

// =======================================================
// PUT: Memperbarui properti yang ada
// =======================================================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      location,
      listingType,
      priceSale,
      priceRent,
      rentPeriod,
      images,
      thumbnail,
      features,
      details,
    } = body;

    const propertyToUpdate = await prisma.property.findUnique({
      where: { slug: (await params).slug },
    });

    if (!propertyToUpdate) {
      return NextResponse.json(
        { error: "Properti tidak ditemukan." },
        { status: 404 }
      );
    }

    // Mengubah detail string dari form menjadi angka jika perlu
    const parsedDetails = Object.entries(details).reduce(
      (acc, [key, value]) => {
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
        } else if (value !== undefined && value !== null) {
          acc[key] = value;
        }
        return acc;
      },
      {} as any
    );

    const { id, propertyId, ...updatableDetails } = parsedDetails;

    await prisma.$transaction(async (tx) => {
      // 1. Update data properti dasar
      await tx.property.update({
        where: { id: propertyToUpdate.id },
        data: {
          title,
          description,
          location,
          images,
          thumbnail: thumbnail || images[0] || null,
          features: features || [],
        },
      });

      // 2. Logika Upsert/Delete untuk listing JUAL
      if (listingType.forSale && priceSale) {
        await tx.forSaleListing.upsert({
          where: { propertyId: propertyToUpdate.id },
          update: { price: Number(priceSale) },
          create: { price: priceSale, propertyId: propertyToUpdate.id },
        });
      } else {
        await tx.forSaleListing.deleteMany({
          where: { propertyId: propertyToUpdate.id },
        });
      }

      // 3. Logika Upsert/Delete untuk listing SEWA
      if (listingType.forRent && priceRent) {
        await tx.forRentListing.upsert({
          where: { propertyId: propertyToUpdate.id },
          update: { price: Number(priceRent), period: rentPeriod },
          create: {
            price: Number(priceRent),
            period: rentPeriod,
            propertyId: propertyToUpdate.id,
          },
        });
      } else {
        await tx.forRentListing.deleteMany({
          where: { propertyId: propertyToUpdate.id },
        });
      }

      // 4. Update detail spesifik
      if (propertyToUpdate.category === "RUMAH") {
        await tx.houseDetails.update({
          where: { propertyId: propertyToUpdate.id },
          data: updatableDetails,
        });
      } else if (propertyToUpdate.category === "TANAH") {
        await tx.landDetails.update({
          where: { propertyId: propertyToUpdate.id },
          data: updatableDetails,
        });
      } else if (propertyToUpdate.category === "RUKO") {
        await tx.shophouseDetails.update({
          where: { propertyId: propertyToUpdate.id },
          data: updatableDetails,
        });
      } else if (propertyToUpdate.category === "APARTEMEN") {
        await tx.apartmentDetails.update({
          where: { propertyId: propertyToUpdate.id },
          data: updatableDetails,
        });
      }
    });

    // [PERBAIKAN] Panggil revalidateTag secara terpisah
    revalidateTag("properties"); // Untuk me-refresh halaman daftar
    revalidateTag(`property:${(await params).slug}`); // Untuk me-refresh halaman detail ini

    return NextResponse.json({ slug: (await params).slug }, { status: 200 });
  } catch (error: any) {
    console.error("Gagal memperbarui properti:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

// =======================================================
// DELETE: Menghapus properti
// =======================================================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await prisma.property.delete({
      where: { slug: (await params).slug },
    });

    // [PERBAIKAN] Gunakan tag yang benar dan panggil secara terpisah
    revalidateTag("properties"); // Untuk me-refresh halaman daftar
    revalidateTag(`property:${(await params).slug}`); // Untuk membersihkan cache detail

    return NextResponse.json(
      { message: "Properti berhasil dihapus." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal menghapus properti:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
