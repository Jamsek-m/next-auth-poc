import { protectPage } from "@/utils/auth";

async function fetchUserInfo(accessToken: string) {
    const resp = await fetch(`${process.env.AUTH_ISSUER}/protocol/openid-connect/userinfo`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (resp.status >= 400) {
        return null;
    }

    return await resp.json();
}

export default async function WhoamiPage() {
    const session = await protectPage();
    const token = (session as any).accessToken;
    const user = await fetchUserInfo(token);

    return (
        <div>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
        </div>
    );
}