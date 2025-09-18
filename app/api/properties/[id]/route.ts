import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET one property
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const property = await prisma.property.findUnique({
    where: { id: (await params).id },
  });
  return NextResponse.json(property);
}

// UPDATE property
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.json();
    const property = await prisma.property.update({
      where: { id: (await params).id },
      data,
    });
    return NextResponse.json(property);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE property
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await prisma.property.delete({
      where: { id: (await params).id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
