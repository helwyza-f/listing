import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // convert ke buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve) => {
    cloudinary.uploader
      .upload_stream({ folder: "properties" }, (error, result) => {
        if (error || !result) {
          resolve(
            NextResponse.json(
              { error: error?.message || "Upload gagal" },
              { status: 500 }
            )
          );
        } else {
          resolve(NextResponse.json({ url: result.secure_url }));
        }
      })
      .end(buffer);
  });
}
