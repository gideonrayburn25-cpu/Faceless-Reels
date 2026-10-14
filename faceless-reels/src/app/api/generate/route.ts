import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNiche } from "@/lib/niches";

// Mock faceless-video generator.
// Returns a placeholder vertical video. Swap this out for fal.ai later.
const MOCK_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const MOCK_THUMB =
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { niche, prompt } = await request.json();
  if (!niche || !prompt || !getNiche(niche)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Check entitlement
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits, is_subscribed")
    .eq("id", user.id)
    .single();

  const credits = profile?.credits ?? 0;
  const isSubscribed = profile?.is_subscribed ?? false;

  if (!isSubscribed && credits <= 0) {
    return NextResponse.json({ error: "No credits left" }, { status: 402 });
  }

  // --- Mock generation (simulate processing time) ---
  await new Promise((r) => setTimeout(r, 1500));

  const { data: video, error: insertError } = await supabase
    .from("videos")
    .insert({
      user_id: user.id,
      niche,
      prompt,
      status: "completed",
      video_url: MOCK_VIDEO_URL,
      thumbnail_url: MOCK_THUMB,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Deduct a credit if not subscribed
  if (!isSubscribed) {
    await supabase
      .from("profiles")
      .update({ credits: credits - 1 })
      .eq("id", user.id);
  }

  return NextResponse.json({ video });
}
