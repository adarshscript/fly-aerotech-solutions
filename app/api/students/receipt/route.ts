import { NextResponse, type NextRequest } from "next/server";
import { getReceiptData } from "@/services/registration.service";
import { generateRegistrationReceipt } from "@/services/receipt.service";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("ref")?.trim() ?? "";

  if (!reference) {
    return NextResponse.json(
      { success: false, error: "A reference number is required." },
      { status: 400 }
    );
  }

  try {
    const receiptData = await getReceiptData(reference);
    if (!receiptData) {
      return NextResponse.json({ success: false, error: "Registration not found." }, { status: 404 });
    }

    const data = await generateRegistrationReceipt(receiptData);
    const sizeBytes = data.byteLength;
    const body = new Uint8Array(data);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="registration-receipt-${reference}.pdf"`,
        "Content-Length": String(sizeBytes),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not generate receipt." },
      { status: 500 }
    );
  }
}
