"use client";

import { useEffect, useState } from "react";
import { DataTable } from "../data-table";
import { columns, LeadPotential } from "./columns";
import { ImportDialog } from "./import-dialog";
import { RefreshCw, Plus } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";

export default function LeadsPotentialPage() {
    const [leads, setLeads] = useState<LeadPotential[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [selectedSource, setSelectedSource] = useState<string>("all");

    // Filter leads based on selected source
    const filteredLeads = selectedSource === "all"
        ? leads
        : leads.filter(lead => lead.leadSource === selectedSource);

    // Get unique sources for dropdown
    const sources = Array.from(new Set(leads.map(l => l.leadSource).filter(Boolean))) as string[];

    // Actually, checking how Checkbox uses `row.getIsSelected()`.
    // The safest way is to derive selected items from the table instance, but we don't have the table instance here easily.
    // ALTERNATIVE: Use `getRowId` option in DataTable if we passed it, but we didn't.
    // Let's assume standard behavior: we need to pass the data and map the selection state indices to the data array indices? 
    // Or simpler: filter the data array based on the indices present in rowSelection if it's `{ [index]: true }`

    // Correction: TanStack Table `rowSelection` is indeed `{ [rowId]: boolean }`. 
    // If we didn't set getRowId, it defaults to index. 
    // So `selectedIds` above are indices "0", "1", etc.
    // We need to map these indices to `leads[index].id`.

    const handleDeleteSelected = async () => {
        if (!confirm(`Are you sure you want to delete ${Object.keys(rowSelection).length} leads?`)) return;

        setLoading(true); // Re-use loading or create new deleting state
        try {
            // Map indices to IDs
            // NOTICE: When filtering, the index in rowSelection might not match the index in 'leads' array if pagination is reset or index tracking is based on view index.
            // TanStack table rowSelection uses the ID we provided or index.
            // Best practice is to enable `getRowId` in DataTable to use actual IDs.
            // Since we didn't, it uses index relative to the DATA passed to it.
            // If we pass `filteredLeads` to DataTable, the indices in `rowSelection` correspond to `filteredLeads` indices.

            const idsToDelete = Object.keys(rowSelection)
                .map(index => filteredLeads[parseInt(index)]?.id)
                .filter(id => id); // Ensure valid IDs

            if (idsToDelete.length === 0) return;

            const res = await fetch("/api/leads/bulk-delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: idsToDelete }),
            });

            if (res.ok) {
                setRowSelection({}); // Clear selection
                fetchLeads(); // Refresh
            } else {
                alert("Failed to delete leads");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newLead, setNewLead] = useState({
        name: "",
        email: "",
        phone: "",
        product: "",
        notes: "",
        leadSource: "", // Default to selected source if creating manually?
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-fill source when opening add dialog
    useEffect(() => {
        if (isAddOpen && selectedSource !== "all") {
            setNewLead(prev => ({ ...prev, leadSource: selectedSource }));
        }
    }, [isAddOpen, selectedSource]);

    const fetchLeads = async () => {
        try {
            const res = await fetch("/api/leads");
            const data = await res.json();
            if (Array.isArray(data)) setLeads(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            await fetch("/api/meta/sync-leads");
            await fetchLeads();
        } catch (err) {
            console.error(err);
        } finally {
            setSyncing(false);
        }
    };

    const handleCreate = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLead),
            });

            if (res.ok) {
                setIsAddOpen(false);
                setNewLead({ name: "", email: "", phone: "", product: "", notes: "", leadSource: "" });
                fetchLeads(); // Refresh list
            } else {
                console.error("Failed to create lead");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Leads Potential</h2>
                    <p className="text-sm text-muted-foreground">Manage lead products and notes.</p>
                </div>

                {/* Source Filter Dropdown */}
                <div className="flex items-center gap-4">
                    <Select value={selectedSource} onValueChange={setSelectedSource}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Databases" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Databases</SelectItem>
                            {sources.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    {Object.keys(rowSelection).length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteSelected}
                            disabled={loading}
                        >
                            Delete Selected ({Object.keys(rowSelection).length})
                        </Button>
                    )}

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Manual Lead
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Lead</DialogTitle>
                                <DialogDescription>
                                    Manually add a potential lead to the system.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input
                                        id="name"
                                        value={newLead.name}
                                        onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={newLead.phone}
                                        onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">Email</Label>
                                    <Input
                                        id="email"
                                        value={newLead.email}
                                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="product" className="text-right">Product</Label>
                                    <Input
                                        id="product"
                                        value={newLead.product}
                                        onChange={(e) => setNewLead({ ...newLead, product: e.target.value })}
                                        className="col-span-3"
                                        placeholder="Product A, Service X..."
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="notes" className="text-right">Notes</Label>
                                    <Input
                                        id="notes"
                                        value={newLead.notes}
                                        onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate} disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Lead"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <ImportDialog onSuccess={fetchLeads} />

                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                        {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        {syncing ? "Syncing..." : "Sync Leads Now"}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <p>Loading leads...</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredLeads}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                />
            )}
        </div>
    );
}
