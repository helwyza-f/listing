import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug },
  });
  return NextResponse.json(property);
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const data = await req.json();
  const updated = await prisma.property.update({
    where: { slug: params.slug },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await prisma.property.delete({
    where: { slug: params.slug },
  });
  return NextResponse.json({ success: true });
}
