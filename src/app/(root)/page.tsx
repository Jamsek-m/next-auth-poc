import { protectPage } from "@/utils/auth";
import Link from "next/link";

export default async function HomePage() {
    const session = await protectPage();
    return (
        <div>
            <h1>Home</h1>
            <pre>
                {JSON.stringify(session.user, null, 2)}
            </pre>

            <div>
                <Link href="/whoami">Who am i?</Link>
            </div>

            <form action="/api/logout" method="POST">
                <button type="submit">Sign out</button>
            </form>
        </div>
    );
}