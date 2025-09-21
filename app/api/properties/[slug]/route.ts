import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const property = await prisma.property.findUnique({
    where: { slug: (await params).slug },
  });
  return NextResponse.json(property);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const data = await req.json();
  const updated = await prisma.property.update({
    where: { slug: (await params).slug },
    data,
  });
  revalidateTag("properties");
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  await prisma.property.delete({
    where: { slug: (await params).slug },
  });
  revalidateTag("properties");
  return NextResponse.json({ success: true });
}
