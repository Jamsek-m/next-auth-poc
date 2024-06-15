import { signOut } from "@/config/auth";

export async function GET() {
    await signOut({redirectTo: "/welcome"});
}