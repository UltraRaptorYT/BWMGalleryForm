import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: "Submit API working perfectly!",
  })
}

export async function POST(req: Request) {
  const data = await req.json()

  const { before, after, message, feedback } = data

  const SHEET_ID = process.env.SHEET_ID!
  const SHEET_NAME = process.env.SHEET_NAME || "FormResponses"

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const sheets = google.sheets({ version: "v4", auth })

  try {
    const timestamp = new Date().toISOString()
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            timestamp,
            before.join(', '),
            after.join(', '),
            message,
            feedback,
          ]
        ],
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error appending to Google Sheet:", err)
    return NextResponse.json({ error: "Failed to write to Google Sheet" }, { status: 500 })
  }
}
