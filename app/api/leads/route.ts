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
            product: l.product,
            notes: l.notes,
            lead_date: l.leadDate ? l.leadDate.toISOString() : "-",
            lead_source: l.leadSource || "-", // New field
        }));

        return NextResponse.json(formattedLeads);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, product, notes, leadSource, status } = body;

        const newLead = await db.lead.create({
            data: {
                name,
                email,
                phone,
                product,
                notes,
                leadSource, // Save source
                status: status || "NEW",
                platformId: "MANUAL",
            },
        });

        return NextResponse.json(newLead);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
