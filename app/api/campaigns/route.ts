import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const campaigns = await db.campaign.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(campaigns);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
