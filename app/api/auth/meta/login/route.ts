import { NextResponse } from "next/server";

export async function GET() {
    const appId = process.env.META_APP_ID;
    // Redirect URI MUST exactly match what you put in Meta App Settings
    // Using localhost:3001 as verified by user
    const redirectUri = "http://localhost:3000/api/auth/meta/callback";

    // Permissions needed:
    // - public_profile (default)
    // Permissions: asking for ads_read to see account data. 
    // 'leads_retrieval' is omitted for now as it usually requires App Review even for devs.
    const scope = "public_profile,email,ads_read";

    // CSRF state (simplified for MVP, ideally should be random string stored in cookie)
    const state = "random_state_string_secret";

    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}`;

    return NextResponse.redirect(url);
}
