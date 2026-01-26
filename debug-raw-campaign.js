const fs = require('fs');

async function main() {
    try {
        const content = fs.readFileSync('.env', 'utf8');
        const match = content.match(/META_USER_ACCESS_TOKEN="?([^"\r\n]+)"?/);
        const token = match ? match[1] : null;

        if (!token) { console.error("No token"); return; }

        // Pick a campaign ID that user likely cares about (from previous verify-data log or just list them)
        // From previous log: 120234356413470617 (Sereal Drink)
        const campaignId = "120234356413470617";

        // User mentioned Aug 8 2025 - Jan 25 2026.
        // Let's fetch maximum range breakdown
        const fields = "spend,impressions,reach,ctr,inline_link_click_ctr,clicks,inline_link_clicks,actions,action_values";
        const url = `https://graph.facebook.com/v19.0/${campaignId}/insights?fields=${fields}&time_increment=1&date_preset=maximum&access_token=${token}`;

        console.log("Fetching URL:", url);

        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            console.error(data.error);
        } else {
            console.log(`Found ${data.data.length} daily records.`);
            if (data.data.length > 0) {
                // Log the first few and last few to see dates
                console.log("First Record:", JSON.stringify(data.data[data.data.length - 1], null, 2));
                console.log("Last Record:", JSON.stringify(data.data[0], null, 2));

                // Aggregate actions to see what keys exist
                const actionKeys = new Set();
                data.data.forEach(d => {
                    if (d.actions) {
                        d.actions.forEach(a => actionKeys.add(a.action_type));
                    }
                });
                console.log("\nAll Action Types Found:", Array.from(actionKeys));
            }
        }

    } catch (e) {
        console.error(e);
    }
}

main();
