import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateLeadSLA } from "@/lib/sla";

export async function GET() {
    try {
        const leads = await db.lead.findMany({
            include: {
                campaign: true,
            },
            orderBy: { createdAt: "desc" },
        });

        const formattedLeads = leads.map((l) => ({
            id: l.id,
            created_at: l.createdAt.toISOString(),
            platform: "META", // Since we only sync Meta for now
            campaign: l.campaign?.name || "Unknown",
            name: l.name || "Unknown",
            email: l.email || "No email",
            phone: l.phone || "No phone",
            status: l.status,
            sales_name: "-", // Need assignment logic later
            sla_status: calculateLeadSLA(l.createdAt.toISOString(), l.status as any),
        }));

        return NextResponse.json(formattedLeads);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
