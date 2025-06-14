import { google } from "googleapis";
import { NextResponse } from "next/server";
import { numberToLetters } from "@/lib/utils";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function GET() {
  return NextResponse.json({ message: "Submit API working perfectly!" });
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const submitType = searchParams.get("submitType");

  const { responses, keys } = await req.json();

  const SHEET_ID = process.env.SHEET_ID!;
  const SHEET_NAME =
    process.env[submitType === "survey" ? "SURVEY_SHEET_NAME" : "SHEET_NAME"] ||
    "FormResponses";

  try {
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Singapore",
    });

    const rowValues = [
      timestamp,
      ...keys.map((key: string) => {
        const val = responses[key];
        return Array.isArray(val) ? val.join(", ") : String(val ?? "");
      }),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:${numberToLetters(rowValues.length)}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowValues],
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error appending to Google Sheet:", err);
    return NextResponse.json(
      { error: "Failed to write to Google Sheet" },
      { status: 500 }
    );
  }
}
