const FACEBOOK_GRAPH_URL = `https://graph.facebook.com/v19.0`;

export async function fetchMetaAdAccounts(accessToken: string) {
    const url = `${FACEBOOK_GRAPH_URL}/me/adaccounts?fields=id,name,account_id&access_token=${accessToken}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);
    return data.data;
}

export async function fetchMetaCampaigns(adAccountId: string, accessToken: string) {
    const url = `${FACEBOOK_GRAPH_URL}/${adAccountId}/campaigns?fields=id,name,status&access_token=${accessToken}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    // Handle pagination for campaigns too if needed, but usually 25 is mostly enough for MVP. 
    // Ideally we should paginate all lists. But let's focus on daily metrics first.
    return data.data;
}

export async function fetchMetaForms(adAccountId: string, accessToken: string) {
    const url = `${FACEBOOK_GRAPH_URL}/${adAccountId}/leadgen_forms?fields=id,name,status&access_token=${accessToken}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.data;
}

export async function fetchMetaLeads(nodeId: string, accessToken: string) {
    const url = `${FACEBOOK_GRAPH_URL}/${nodeId}/leads?fields=id,created_time,field_data,campaign_id,ad_id&access_token=${accessToken}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.data;
}

export async function fetchMetaDailyMetrics(campaignId: string, accessToken: string, days = 30) {
    // 1. Determine Preset
    // Invalid: last_365d. Valid: last_90d, maximum.
    let preset = `last_${days}d`;
    if (days > 90) preset = 'maximum';

    const fields = "spend,impressions,reach,ctr,inline_link_click_ctr,clicks,inline_link_clicks,actions";
    let url = `${FACEBOOK_GRAPH_URL}/${campaignId}/insights?fields=${fields}&time_increment=1&date_preset=${preset}&access_token=${accessToken}&limit=100`; // Increase limit to 100

    let allData: any[] = [];

    // 2. Fetch with Pagination Loop
    while (url) {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) throw new Error(data.error.message);

        if (data.data) {
            allData = allData.concat(data.data);
        }

        // Check for next page
        if (data.paging && data.paging.next) {
            url = data.paging.next;
        } else {
            url = ""; // Stop loop
        }
    }

    return allData;
}

// Deprecated single metric fetch, kept for compatibility if imported somewhere else?
// We updated sync-metrics to use fetchMetaDailyMetrics, so this might not be needed.
// But better keep it or remove it safely.
export async function fetchMetaMetrics(campaignId: string, accessToken: string) {
    return fetchMetaDailyMetrics(campaignId, accessToken, 1).then(res => res[0]);
}
