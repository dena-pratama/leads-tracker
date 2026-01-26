import { Lead } from "@/app/(dashboard)/leads/columns";

export type FunnelStep = {
    label: string;
    count: number;
    conversionRate?: number; // Rate from previous step
    dropOffRate?: number;
    color: string;
};

export function calculateFunnelStats(leads: Lead[]): FunnelStep[] {
    const total = leads.length;

    // Logic: 
    // 1. Total (All)
    // 2. Contacted (Status != NEW) -> Assuming linear flow: NEW -> CONTACTED -> QUALIFIED -> WON/LOST
    //    Actually, usually LOST happens at various stages. But for MVP let's assume:
    //    Reaced Contacted = All - NEW
    //    Reached Qualified = QUALIFIED + WON
    //    Reached Won = WON

    const contactedCount = leads.filter(l => ["CONTACTED", "QUALIFIED", "WON", "LOST", "FOLLOW_UP"].includes(l.status)).length;
    const qualifiedCount = leads.filter(l => ["QUALIFIED", "WON"].includes(l.status)).length;
    const wonCount = leads.filter(l => l.status === "WON").length;

    return [
        {
            label: "Total Leads",
            count: total,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "Contacted",
            count: contactedCount,
            conversionRate: total > 0 ? (contactedCount / total) * 100 : 0,
            color: "bg-yellow-100 text-yellow-700",
        },
        {
            label: "Qualified",
            count: qualifiedCount,
            conversionRate: contactedCount > 0 ? (qualifiedCount / contactedCount) * 100 : 0,
            color: "bg-purple-100 text-purple-700",
        },
        {
            label: "Won",
            count: wonCount,
            conversionRate: qualifiedCount > 0 ? (wonCount / qualifiedCount) * 100 : 0,
            color: "bg-green-100 text-green-700",
        },
    ];
}
