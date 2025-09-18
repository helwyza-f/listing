import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all properties
export async function GET() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(properties);
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // ganti spasi dengan -
    .replace(/[^\w\-]+/g, "") // hapus karakter aneh
    .replace(/\-\-+/g, "-"); // hapus double -
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const slug = slugify(data.title);

    const property = await prisma.property.create({
      data: {
        title: data.title,
        slug, // wajib isi slug
        description: data.description,
        price: data.price,
        location: data.location,
        features: data.features || [],
        images: data.images || [],
        agentId: data.agentId || null,
      },
    });

    return NextResponse.json(property);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
