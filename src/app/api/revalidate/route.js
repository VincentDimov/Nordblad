import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");

    // Check the secret to protect the route
    if (secret !== process.env.STORYBLOK_WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    const payload = await request.json();

    // Revalidate the specific Storyblok path if a slug is provided.
    if (payload.full_slug) {
      revalidatePath(`/${payload.full_slug}`);
    }
    
    // These pages contain Storyblok-driven article listings.
    revalidatePath("/articles");
    revalidatePath("/authors");
    revalidatePath("/", "layout");

    return NextResponse.json({ revalidated: true, now: Date.now(), slug: payload.full_slug });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
