import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/graphql-client";
import { SUBMIT_CONTACT_FORM } from "@/lib/queries/contact";

type FieldValue = {
  id: number;
  value?: string;
  emailValues?: { value: string };
  nameValues?: {
    prefix?: string;
    first?: string;
    middle?: string;
    last?: string;
    suffix?: string;
  };
};

type SubmitResult = {
  submitGfForm: {
    errors: { id: number; message: string }[] | null;
    entry: { databaseId: number } | null;
    confirmation: { message: string | null; type: string | null; url: string | null } | null;
  };
};

export async function POST(request: NextRequest) {
  let body: { id: number; fieldValues: FieldValue[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.id || !Array.isArray(body.fieldValues)) {
    return NextResponse.json({ message: "Missing id or fieldValues" }, { status: 400 });
  }

  try {
    const client = getClient();
    const data = await client.request<SubmitResult>(SUBMIT_CONTACT_FORM, {
      input: { id: body.id, fieldValues: body.fieldValues },
    });

    const result = data.submitGfForm;
    if (result.errors && result.errors.length > 0) {
      return NextResponse.json({ errors: result.errors }, { status: 422 });
    }

    return NextResponse.json({
      ok: true,
      confirmation: result.confirmation?.message || "Thanks — we'll be in touch.",
      redirectUrl: result.confirmation?.type === "REDIRECT" ? result.confirmation.url : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
