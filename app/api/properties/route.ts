import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";
// GET all properties
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// CREATE property
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, location, features, images, thumbnail } =
      body;

    const slug = slugify(title, { lower: true, strict: true });

    const property = await prisma.property.create({
      data: {
        title,
        slug,
        description, // simpan HTML string dari rich editor
        price,
        location,
        features,
        images,
        thumbnail,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
