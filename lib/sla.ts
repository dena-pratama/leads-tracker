import { differenceInDays } from "date-fns";

export type SLAStatus = "ON_TRACK" | "WARNING" | "OVERDUE";

export const SLA_THRESHOLDS = {
    WARNING: 2, // days
    OVERDUE: 5, // days
};

/**
 * Calculates the SLA status of a lead.
 * Logic:
 * - If status is WON or LOST, SLA is N/A (returns ON_TRACK for now).
 * - If age > 5 days -> OVERDUE
 * - If age > 2 days -> WARNING
 * - Else -> ON_TRACK
 */
export function calculateLeadSLA(createdAt: string | Date, status: string): SLAStatus {
    // 1. If lead is already closed, SLA doesn't apply (or is stopped)
    if (["WON", "LOST"].includes(status)) {
        return "ON_TRACK";
    }

    const created = new Date(createdAt);
    const now = new Date();
    const daysDiff = differenceInDays(now, created);

    if (daysDiff > SLA_THRESHOLDS.OVERDUE) {
        return "OVERDUE";
    }

    if (daysDiff > SLA_THRESHOLDS.WARNING) {
        return "WARNING";
    }

    return "ON_TRACK";
}

export function getSLAColor(sla: SLAStatus): string {
    switch (sla) {
        case "OVERDUE":
            return "text-red-600 bg-red-50 border-red-200";
        case "WARNING":
            return "text-yellow-600 bg-yellow-50 border-yellow-200";
        default:
            return "text-green-600 bg-green-50 border-green-200";
    }
}
