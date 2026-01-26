"use client";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Connect Platforms</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            f
                        </div>
                        <div>
                            <div className="font-medium">Meta Ads (Facebook & Instagram)</div>
                            <div className="text-sm text-gray-500">Not connected</div>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.href = "/api/auth/meta/login"}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                        Connect
                    </button>
                </div>
            </div>
        </div>
    );
}
