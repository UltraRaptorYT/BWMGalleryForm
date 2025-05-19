import { NextResponse } from "next/server";
// import { google } from "googleapis";

export async function GET() {
    return NextResponse.json({
        message: "Submit API working perfectly!",
    });
}

export async function POST(req: Request) {
    const data = await req.json()

    console.log('Received Submission:', data)

    // TODO: Store in database / Supabase
    return NextResponse.json({ success: true })
    //   const { name, email, SHEET_ID, SHEET_NAME } = await request.json();

    //   const auth = new google.auth.GoogleAuth({
    //     credentials: {
    //       client_email: process.env.GOOGLE_SERVICE_EMAIL,
    //       private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    //     },
    //     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    //   });

    //   const sheets = google.sheets({ version: "v4", auth });

    //   try {
    //     const rowsRes = await sheets.spreadsheets.values.get({
    //       spreadsheetId: SHEET_ID,
    //       range: `${SHEET_NAME}!A2:D`,
    //     });

    //     const rows = rowsRes.data.values || [];
    //     const isRegistered = rows.some((row) => row[1] === email);

    //     await sheets.spreadsheets.values.append({
    //       spreadsheetId: SHEET_ID,
    //       range: `${SHEET_NAME}!A:D`,
    //       valueInputOption: "USER_ENTERED",
    //       requestBody: {
    //         values: [
    //           [name, email, new Date().toISOString(), isRegistered ? "Yes" : "No"],
    //         ],
    //       },
    //     });

    //     return NextResponse.json({
    //       message: isRegistered ? "Already registered" : "New registration",
    //     });
    //   } catch (err) {
    //     console.error(err);
    //     return NextResponse.json(
    //       { error: "Failed to write to sheet" },
    //       { status: 500 }
    //     );
    //   }
}