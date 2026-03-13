import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (userId === "demo-user-id" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json([
        { id: "demo-job-1", title: "Frontend Engineer", company: "Nexus Dynamics", location: "Remote", salary: "$140k - $180k", job_url: "#", bookmarked: true, created_at: new Date().toISOString() }
      ]);
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", userId)
      .eq("bookmarked", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const job = await request.json();

    if (job.user_id === "demo-user-id" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ ...job, id: "demo-job-" + Date.now(), created_at: new Date().toISOString() });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jobs")
      .upsert([job])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    if (id.startsWith("demo-") || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: true });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
