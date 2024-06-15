import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { protectPage } from "@/utils/auth";

export async function POST(req: NextRequest) {
    const session = await protectPage();

    const redirectUrl = buildRedirectUrl(req.cookies, "/api/logout/callback");

    const logoutUrl = `${process.env.AUTH_ISSUER}/protocol/openid-connect/logout` +
        `?client_id=${process.env.AUTH_CLIENT_ID}` +
        `&id_token_hint=${session.idToken}` +
        `&post_logout_redirect_uri=${redirectUrl}`;

    redirect(logoutUrl);
}

function buildRedirectUrl(cookies: RequestCookies, path: string): string {
    let rootUrl = cookies.get("authjs.callback-url")?.value ?? "http://localhost:3000/";
    if (rootUrl.endsWith("/")) {
        rootUrl = rootUrl.slice(0, -1);
    }
    return `${rootUrl}${path}`;
}