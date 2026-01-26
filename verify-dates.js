const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const allMetrics = await prisma.adMetricDaily.findMany({
        select: { date: true }
    });

    console.log(`Total Metric Records: ${allMetrics.length}`);

    if (allMetrics.length === 0) return;

    // Group by Month-Year
    const distribution = {};
    let minDate = new Date();
    let maxDate = new Date(0);

    allMetrics.forEach(m => {
        const d = new Date(m.date);
        if (d < minDate) minDate = d;
        if (d > maxDate) maxDate = d;

        const key = `${d.getFullYear()}-${d.getMonth() + 1}`; // e.g. 2025-8
        distribution[key] = (distribution[key] || 0) + 1;
    });

    console.log("Date Range:", minDate.toISOString().split('T')[0], "to", maxDate.toISOString().split('T')[0]);
    console.log("Distribution by Month:", distribution);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
