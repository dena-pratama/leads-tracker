"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Lead = {
    id: string
    created_at: string
    platform: "META" | "GOOGLE" | "TIKTOK"
    campaign: string
    name: string
    email: string
    phone: string
    status: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "WON"
    sla_status: "ON_TRACK" | "WARNING" | "OVERDUE"
    sales_name: string
}

export const columns: ColumnDef<Lead>[] = [
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
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("created_at")}</div>,
    },
    {
        accessorKey: "platform",
        header: "Platform",
        cell: ({ row }) => {
            const platform = row.getValue("platform") as string
            return (
                <Badge variant="outline" className={
                    platform === "META" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        platform === "GOOGLE" ? "bg-red-50 text-red-700 border-red-200" : "bg-gray-100"
                }>
                    {platform}
                </Badge>
            )
        }
    },
    {
        accessorKey: "campaign",
        header: "Campaign",
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return (
                <div>
                    <div className="font-medium">{row.getValue("name")}</div>
                    <div className="text-xs text-muted-foreground">{row.original.email}</div>
                </div>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge className={
                    status === "NEW" ? "bg-blue-500" :
                        status === "WON" ? "bg-green-500" :
                            status === "LOST" ? "bg-gray-500" : "bg-yellow-500"
                }>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "sla_status",
        header: "SLA",
        cell: ({ row }) => {
            const sla = row.getValue("sla_status") as string
            return (
                <div className={
                    sla === "OVERDUE" ? "text-red-600 font-bold text-xs" :
                        sla === "WARNING" ? "text-yellow-600 font-medium text-xs" : "text-green-600 text-xs"
                }>
                    {sla}
                </div>
            )
        }
    },
    {
        accessorKey: "sales_name",
        header: "Sales",
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
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
