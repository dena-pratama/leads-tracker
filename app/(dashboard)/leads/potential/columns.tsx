"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
// import { useRouter } from "next/navigation"

export type LeadPotential = {
    id: string
    created_at: string
    lead_date?: string // New field
    leadSource?: string // New field
    platform: "META" | "GOOGLE" | "TIKTOK"
    campaign: string
    name: string
    email: string
    phone: string
    status: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "WON"
    sla_status: "ON_TRACK" | "WARNING" | "OVERDUE"
    sales_name: string
    product?: string | null
    notes?: string | null
}

const ProductCell = ({ row }: { row: any }) => {
    const lead = row.original as LeadPotential
    const [product, setProduct] = useState(lead.product || "")
    const [loading, setLoading] = useState(false)
    // const router = useRouter()

    const updateProduct = async (value: string) => {
        setProduct(value);
        // Only update if value actually changed? Select implies change.
        setLoading(true)
        try {
            await fetch(`/api/leads/${lead.id}`, {
                method: "PATCH",
                body: JSON.stringify({ product: value }),
            })
            // No strict need to refresh if purely local, but good for consistency if other things change
            // router.refresh() 
        } catch (error) {
            console.error("Failed to update product:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            onBlur={() => updateProduct(product)}
            disabled={loading}
            className="h-8 w-[140px] text-xs"
            placeholder="Product..."
        />
    )
}

const NotesCell = ({ row }: { row: any }) => {
    const lead = row.original as LeadPotential
    const [notes, setNotes] = useState(lead.notes || "")
    const [loading, setLoading] = useState(false)
    // const router = useRouter()

    const handleBlur = async () => {
        if (notes === (lead.notes || "")) return
        setLoading(true)
        try {
            await fetch(`/api/leads/${lead.id}`, {
                method: "PATCH",
                body: JSON.stringify({ notes }),
            })
            // router.refresh()
        } catch (error) {
            console.error("Failed to update notes:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleBlur}
            disabled={loading}
            className="h-8 min-w-[150px] text-xs"
            placeholder="Add notes..."
        />
    )
}

export const columns: ColumnDef<LeadPotential>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Input Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase text-xs">{row.getValue("created_at")}</div>,
    },
    {
        accessorKey: "lead_date",
        header: "Lead Date",
        cell: ({ row }) => <div className="lowercase text-xs">{row.getValue("lead_date") || "-"}</div>,
    },
    {
        accessorKey: "leadSource",
        header: "Source",
        cell: ({ row }) => <div className="lowercase text-xs">{row.getValue("leadSource") || "-"}</div>,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return (
                <div>
                    <div className="font-medium text-sm">{row.getValue("name")}</div>
                    <div className="text-xs text-muted-foreground">{row.original.email}</div>
                </div>
            )
        }
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => <div className="text-xs">{row.getValue("phone")}</div>,
    },
    {
        accessorKey: "product",
        header: "Product",
        cell: ({ row }) => <ProductCell row={row} />,
    },
    {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => <NotesCell row={row} />,
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const lead = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(lead.id)}
                        >
                            Copy Lead ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={async () => {
                                if (confirm("Are you sure you want to delete this lead?")) {
                                    await fetch(`/api/leads/${lead.id}`, { method: "DELETE" });
                                    window.location.reload();
                                }
                            }}
                        >
                            Delete Lead
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
