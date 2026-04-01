import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // For this implementation, we return the data URL directly
    // In production, you would upload to a cloud storage service like Vercel Blob
    return NextResponse.json({ url: image });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}