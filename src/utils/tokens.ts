export async function refreshAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
    const tokenEndpoint = `${process.env.AUTH_ISSUER}/protocol/openid-connect/token`;

    const payload = encodeFormUrl({
        client_id: clientId,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_secret: clientSecret,
    });

    const response = await fetch(tokenEndpoint, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: payload,
    });

    if (!response.ok || response.status >= 400) {
        throw new Error(`Error refreshing tokens! ${response.status}`);
    }

    const responsePayload = await response.json();

    return {
        accessToken: responsePayload.access_token,
        idToken: responsePayload.id_token,
        expiresIn: responsePayload.expires_in ?? 1,
        refreshToken: responsePayload.refresh_token ?? refreshToken,
    };
}

function encodeFormUrl(data: Record<string, string>): string {
    return Object.entries(data).map(([key, value]) => {
        return `${key}=${value}`;
    }).join("&");
}

export function mapToSessionCredentials(accessToken: string,
                                        refreshToken: string,
                                        idToken: string,
                                        expiresIn: number) {
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        idToken: idToken,
        expiresAt: Date.now() + expiresIn * 1000,
    };
}