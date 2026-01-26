import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/lib/encryption";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
        return NextResponse.json({ error: "Login failed or cancelled" }, { status: 400 });
    }

    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const redirectUri = "http://localhost:3000/api/auth/meta/callback";

    try {
        // 1. Exchange Code for Access Token
        const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`;

        const tokenRes = await fetch(tokenUrl);
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            throw new Error(tokenData.error.message);
        }

        const accessToken = tokenData.access_token;

        // 2. Get User Info (to confirm ID/Name)
        const userUrl = `https://graph.facebook.com/me?access_token=${accessToken}`;
        const userRes = await fetch(userUrl);
        const userData = await userRes.json();

        // 3. Encrypt Token
        const encryptedToken = encrypt(accessToken);

        // 4. Save to Database (PlatformAccount)
        // NOTE: In real app, we should link this to the current logged-in Workspace/User.
        // For MVP, we'll create a default Workspace if not exists or use the first one.

        // Check if a workspace exists, if not create one
        let workspace = await db.workspace.findFirst();
        if (!workspace) {
            // Need a user to own workspace. MVP workaround: finding first user
            // Ideally we use auth() from Clerk to get current user ID
            const user = await db.user.findFirst();
            if (user) {
                workspace = await db.workspace.create({
                    data: {
                        name: "My Workspace",
                        ownerId: user.id
                    }
                });
            }
        }

        // Upsert PlatformAccount
        if (workspace) {
            // Find existing meta account for this workspace to update, or create new
            const existingAccount = await db.platformAccount.findFirst({
                where: {
                    platform: "META",
                    workspaceId: workspace.id,
                    accountId: userData.id // Using User ID as Account ID for now (usually it's Ad Account ID later)
                }
            });

            if (existingAccount) {
                await db.platformAccount.update({
                    where: { id: existingAccount.id },
                    data: {
                        accessToken: encryptedToken,
                        tokenExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // ~60 days for long lived
                    }
                });
            } else {
                await db.platformAccount.create({
                    data: {
                        platform: "META",
                        accountId: userData.id,
                        accessToken: encryptedToken,
                        workspaceId: workspace.id,
                        tokenExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
                    }
                });
            }
        } else {
            // Fallback if no user/workspace exists (should not happen if logged in)
            console.warn("No workspace found to link Meta account");
        }

        // 5. Redirect back to Settings
        return NextResponse.redirect("http://localhost:3000/settings?connected=true");

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
