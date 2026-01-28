"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon, FileSpreadsheet, Download } from "lucide-react";
import * as XLSX from "xlsx";

interface ImportDialogProps {
    onSuccess: () => void;
}

interface LeadImport {
    name: string;
    email: string;
    phone: string;
    product: string;
    notes: string;
    leadDate?: string;
    leadSource?: string;
}

export function ImportDialog({ onSuccess }: ImportDialogProps) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"file" | "url">("file");
    const [url, setUrl] = useState("");
    const [parsedLeads, setParsedLeads] = useState<LeadImport[]>([]); // Typed
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [source, setSource] = useState("Imported");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        try {
            const data = await file.arrayBuffer();
            parseExcel(data);
        } catch (err) {
            setError("Failed to read file");
            console.error(err);
        }
    };

    const handleUrlFetch = async () => {
        if (!url) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch URL");
            const data = await res.arrayBuffer();
            parseExcel(data);
        } catch (err) {
            setError("Failed to fetch sheet from URL. Ensure it's public.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const parseExcel = (data: ArrayBuffer) => {
        try {
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Normalize keys to lowercase? Or expect specific columns?
            // Let's assume headers are somewhat flexible or we just map them.
            // For now, map loosely based on expected keys.
            const mapped: LeadImport[] = jsonData.map((row: any) => ({
                name: row["Name"] || row["name"] || row["Nama"] || "Unknown",
                email: row["Email"] || row["email"] || "",
                phone: row["Phone"] || row["phone"] || row["HP"] || row["No HP"] || "",
                product: row["Product"] || row["product"] || row["Produk"] || "",
                notes: row["Notes"] || row["notes"] || row["Catatan"] || "",
                leadDate: row["Date"] || row["date"] || row["Tanggal"] || new Date().toISOString(),
                // Use row source if available, otherwise use state source
                leadSource: row["Source"] || row["source"] || source,
            })).filter((l: LeadImport) => l.name !== "Unknown"); // Filter empty rows

            setParsedLeads(mapped);
        } catch (err) {
            setError("Failed to parse Excel data");
            console.error(err);
        }
    };

    const handleImport = async () => {
        if (parsedLeads.length === 0) return;
        setLoading(true);
        try {
            // Update source if changed in UI before import
            const finalLeads = parsedLeads.map(l => ({ ...l, leadSource: l.leadSource || source }));

            const res = await fetch("/api/leads/bulk-import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leads: finalLeads }),
            });

            if (res.ok) {
                setOpen(false);
                setParsedLeads([]);
                setUrl("");
                onSuccess();
            } else {
                const json = await res.json();
                setError(json.error || "Import failed");
            }
        } catch (err) { // Handle unused err
            console.error(err);
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Import
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Leads</DialogTitle>
                    <DialogDescription>
                        Import leads from Excel file or Google Sheet (Public CSV link).
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-2 mb-4 border-b">
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'file' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        onClick={() => setActiveTab("file")}
                    >
                        File Upload
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'url' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        onClick={() => setActiveTab("url")}
                    >
                        Sheet URL
                    </button>
                </div>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Default Source / Database Name</Label>
                        <Input
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            placeholder="e.g. Sales WA 1"
                        />
                        <p className="text-xs text-muted-foreground">Will be used if &apos;Source&apos; column is missing in file.</p>
                    </div>

                    {activeTab === "file" ? (
                        <div className="grid gap-2">
                            <Label>Upload Excel/CSV</Label>
                            <Input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            <Label>Sheet URL (Public Link)</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://docs.google.com/..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                                <Button onClick={handleUrlFetch} disabled={loading} size="icon">
                                    <LinkIcon className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Make sure the link is publicly accessible (CSV export preferred).</p>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    {parsedLeads.length > 0 && (
                        <div className="bg-muted p-3 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-sm">Ready to import</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Found <strong>{parsedLeads.length}</strong> leads.
                            </p>
                            <div className="text-xs text-muted-foreground mt-1 max-h-20 overflow-y-auto">
                                Preview: {parsedLeads[0].name}, Src: {parsedLeads[0].leadSource}, ...
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={handleImport} disabled={parsedLeads.length === 0 || loading}>
                        {loading ? "Importing..." : "Import Leads"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
