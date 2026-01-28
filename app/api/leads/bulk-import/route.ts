import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { leads } = body;

        if (!Array.isArray(leads) || leads.length === 0) {
            return NextResponse.json({ error: "Invalid data format or empty list" }, { status: 400 });
        }

        const createdLeads = await db.lead.createMany({
            data: leads.map((lead: any) => ({
                name: lead.name || "Unknown",
                email: lead.email || null,
                phone: lead.phone || null,
                product: lead.product || null,
                notes: lead.notes || null,
                status: "NEW", // Default status
                platformId: "IMPORT", // Indicator for imported leads
                leadSource: lead.leadSource || null, // Capture source from import if any, or default
                leadDate: (() => {
                    if (!lead.leadDate) return new Date();
                    const d = new Date(lead.leadDate);
                    return isNaN(d.getTime()) ? new Date() : d;
                })(),
            })),
            skipDuplicates: true, // Optional: skip if ID conflicts (unlikely with UUID) or unique constraints
        });

        return NextResponse.json({ success: true, count: createdLeads.count });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
