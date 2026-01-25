import { DataTable } from "./data-table"
import { columns, Lead } from "./columns"

async function getLeads(): Promise<Lead[]> {
    // Dummy data for MVP demo
    return [
        {
            id: "LEAD-001",
            created_at: "2024-03-10",
            platform: "META",
            campaign: "Promo Ramadhan",
            name: "Budi Santoso",
            email: "budi@gmail.com",
            phone: "081234567890",
            status: "NEW",
            sla_status: "ON_TRACK",
            sales_name: "-"
        },
        {
            id: "LEAD-002",
            created_at: "2024-03-09",
            platform: "META",
            campaign: "Promo Ramadhan",
            name: "Siti Aminah",
            email: "siti@yahoo.com",
            phone: "081987654321",
            status: "CONTACTED",
            sla_status: "WARNING",
            sales_name: "Andi Sales"
        },
        {
            id: "LEAD-003",
            created_at: "2024-03-05",
            platform: "GOOGLE",
            campaign: "Search Jas Hujan",
            name: "Rudi Hartono",
            email: "rudi.h@gmail.com",
            phone: "085678901234",
            status: "NEW",
            sla_status: "OVERDUE",
            sales_name: "-"
        },
        {
            id: "LEAD-004",
            created_at: "2024-03-11",
            platform: "TIKTOK",
            campaign: "Viral Video A",
            name: "Citra Kirana",
            email: "citra@gmail.com",
            phone: "081234567888",
            status: "WON",
            sla_status: "ON_TRACK",
            sales_name: "Budi Sales"
        },
        {
            id: "LEAD-005",
            created_at: "2024-03-08",
            platform: "META",
            campaign: "Promo Ramadhan",
            name: "Eko Patrio",
            email: "eko@gmail.com",
            phone: "081233334444",
            status: "LOST",
            sla_status: "ON_TRACK",
            sales_name: "Andi Sales"
        },
    ]
}

export default async function LeadsPage() {
    const data = await getLeads()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
                    <p className="text-sm text-gray-500">Manage and track your leads from all platforms.</p>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">
                    Sync Leads Now
                </button>
            </div>

            <DataTable columns={columns} data={data} />
        </div>
    );
}
