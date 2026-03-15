import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  // Handle demo mode or missing keys
  if (userId === "demo-user-id" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json([
      { id: "demo-1", title: "Welcome to Shax AI", content: "This is a simulated note. In a real environment, your data is stored securely in Supabase.", tags: ["demo", "welcome"], created_at: new Date().toISOString() },
      { id: "demo-2", title: "Productivity Tip", content: "Chain your tools together using the Workflow Builder to automate repetitive tasks.", tags: ["tips"], created_at: new Date().toISOString() }
    ]);
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const note = await request.json();

    if (note.user_id === "demo-user-id" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ ...note, id: "demo-" + Date.now(), created_at: new Date().toISOString() });
    }

    const { data, error } = await supabase
      .from("notes")
      .insert([note])
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
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
  }

  if (id.startsWith("demo-") || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ success: true });
  }

  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  try {
    const note = await request.json();

    if (note.id?.toString().startsWith("demo-") || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(note);
    }

    const { data, error } = await supabase
      .from("notes")
      .update(note)
      .eq("id", note.id)
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
