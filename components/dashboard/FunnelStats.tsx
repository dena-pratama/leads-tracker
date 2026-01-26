import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateFunnelStats } from "@/lib/funnel";
import { Lead } from "@/app/(dashboard)/leads/columns";

interface FunnelStatsProps {
    leads: Lead[];
}

export function FunnelStats({ leads }: FunnelStatsProps) {
    const stats = calculateFunnelStats(leads);
    const maxCount = stats[0].count || 1; // Avoid division by zero

    return (
        <Card>
            <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {stats.map((step, index) => {
                    // Calculate width relative to total for visualization
                    const percentage = (step.count / maxCount) * 100;

                    return (
                        <div key={step.label} className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${step.color.split(" ")[0]}`} />
                                    <span>{step.label}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {step.conversionRate !== undefined && (
                                        <span className="text-xs text-muted-foreground">
                                            Conv: {step.conversionRate.toFixed(1)}%
                                        </span>
                                    )}
                                    <span>{step.count}</span>
                                </div>
                            </div>

                            <div className="relative w-full h-3 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ease-in-out ${step.color.replace("text", "bg").split(" ")[0].replace("-100", "-500")}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            {/* Visual arrow to next step if not last */}
                            {index < stats.length - 1 && (
                                <div className="flex justify-center -my-1">
                                    <div className="w-0.5 h-3 bg-gray-200"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
