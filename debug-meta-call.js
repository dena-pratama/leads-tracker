const fs = require('fs');

async function main() {
    try {
        const content = fs.readFileSync('.env', 'utf8');
        const match = content.match(/META_USER_ACCESS_TOKEN="?([^"\r\n]+)"?/);
        const token = match ? match[1] : null;

        if (!token) { console.error("No token"); return; }

        const campaignId = "120234356413470617"; // Sereal Drink
        const days = 365;

        // Test the exact URL we used in lib/meta.ts
        const fields = "spend,impressions,reach,ctr,inline_link_click_ctr,clicks,inline_link_clicks,actions";
        const url = `https://graph.facebook.com/v19.0/${campaignId}/insights?fields=${fields}&time_increment=1&date_preset=last_${days}d&access_token=${token}`;

        console.log("Testing URL:", url);

        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            console.error("API Error:", data.error);
        } else {
            console.log("Success!");
            console.log("Record count:", data.data.length);
            if (data.data.length > 0) {
                console.log("First date:", data.data[data.data.length - 1].date_start);
                console.log("Last date:", data.data[0].date_start);
            }
        }

    } catch (e) {
        console.error(e);
    }
}

main();
