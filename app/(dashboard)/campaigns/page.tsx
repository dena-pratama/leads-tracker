export default function CampaignsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Campaigns</h2>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Sync Campaigns
                </button>
            </div>
            <div className="bg-white p-12 rounded-xl border border-dashed flex items-center justify-center text-gray-400">
                Campaigns List will be here
            </div>
        </div>
    );
}
