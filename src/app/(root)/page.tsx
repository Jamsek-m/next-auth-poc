import { signOut } from "@/config/auth";
import { protectPage } from "@/utils/auth";
import Link from "next/link";

export default async function HomePage() {
    const session = await protectPage();
    console.log("PAGE:", session.user);
    return (
        <div>
            <h1>Home</h1>
            <pre>
                {JSON.stringify(session.user, null, 2)}
            </pre>

            <div>
                <Link href="/whoami">Who am i?</Link>
            </div>

            <form action={async () => {
                "use server";
                await signOut({redirectTo: "/welcome"});
            }}>
                <button type="submit">Sign out</button>
            </form>
        </div>
    );
}