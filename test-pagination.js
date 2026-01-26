const fs = require('fs');

async function main() {
    try {
        const content = fs.readFileSync('.env', 'utf8');
        const match = content.match(/META_USER_ACCESS_TOKEN="?([^"\r\n]+)"?/);
        const token = match ? match[1] : null;

        if (!token) { console.error("No token"); return; }

        // Sereal Drink Campaign
        const campaignId = "120234356413470617";

        // This logic mimics what we put in lib/meta.ts
        const fields = "spend,impressions,reach,ctr,clicks,actions";
        // NOTE: Testing `maximum` preset and pagination loop
        let url = `https://graph.facebook.com/v19.0/${campaignId}/insights?fields=${fields}&time_increment=1&date_preset=maximum&access_token=${token}&limit=25`; // Use small limit to force pagination

        console.log("Starting fetch...");
        console.log("Initial URL:", url);

        let allData = [];
        let pageCount = 0;

        while (url) {
            pageCount++;
            console.log(`Fetching page ${pageCount}...`);
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                console.error("API Error:", data.error.message);
                break;
            }

            if (data.data) {
                console.log(`  > Got ${data.data.length} records.`);
                allData = allData.concat(data.data);
                // Log dates of this chunk
                if (data.data.length > 0) {
                    const first = data.data[data.data.length - 1].date_start;
                    const last = data.data[0].date_start;
                    console.log(`    Date range: ${first} to ${last}`);
                }
            }

            if (data.paging && data.paging.next) {
                url = data.paging.next;
                console.log("  > Next page found.");
            } else {
                url = "";
                console.log("  > No next page.");
            }
        }

        console.log(`\nTotal Records Fetched: ${allData.length}`);
        if (allData.length > 0) {
            console.log("Oldest Date:", allData[allData.length - 1].date_start);
            console.log("Newest Date:", allData[0].date_start);
        }

    } catch (e) {
        console.error(e);
    }
}

main();
