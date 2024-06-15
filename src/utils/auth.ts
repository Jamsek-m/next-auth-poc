import { AppSession, auth } from "@/config/auth";
import { redirect } from "next/navigation";

export async function protectPage(redirectUrlOnNoSession = "/welcome"): Promise<AppSession> {
    const session = await auth();
    if (!session || !session.user) {
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
