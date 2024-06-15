import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

export async function protectPage(redirectUrlOnNoSession = "/welcome") {
    const session = await auth();
    if (!session || !session.user) {
        redirect(redirectUrlOnNoSession);
    }
    return session;
}

export async function hidePageForUser(redirectUrlOnSession = "/") {
    const session = await auth();
    if (session && session.user) {
        redirect(redirectUrlOnSession);
    }
}
