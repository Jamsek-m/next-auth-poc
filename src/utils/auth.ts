import { AppSession, auth } from "@/config/auth";
import { redirect } from "next/navigation";

function validateSession(session: AppSession): boolean {
    return !!session && session?.error !== "RefreshAccessTokenError" && !!session.user;
}

export async function protectPage(redirectUrlOnNoSession = "/welcome"): Promise<AppSession> {
    const session = await auth() as AppSession;
    if (!validateSession(session)) {
        redirect(redirectUrlOnNoSession);
    }
    return session as AppSession;
}

export async function hidePageForUser(redirectUrlOnSession = "/") {
    const session = await auth();
    if (session && session.user) {
        redirect(redirectUrlOnSession);
    }
}

export async function getAccessToken(redirectUrlOnNoSession = "/welcome"): Promise<string> {
    const session = await auth() as AppSession;

    if (!validateSession(session)) {
        redirect(redirectUrlOnNoSession);
    }

    return getAccessTokenFromSession(session);
}

export function getAccessTokenFromSession(session: AppSession): string {
    return session.accessToken;
}
