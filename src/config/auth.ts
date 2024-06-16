import NextAuth, { DefaultSession } from "next-auth";
import { mapToSessionCredentials, refreshAccessToken } from "@/utils/tokens";

export type AppSession = DefaultSession & {
    accessToken: string,
    idToken: string,
    user: {
        user_id: string;
    },
    error?: "RefreshAccessTokenError";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        {
            id: "default",
            name: "OpenId Connect Provider",
            type: "oidc",
            issuer: process.env.AUTH_ISSUER,
            clientId: process.env.AUTH_CLIENT_ID,
            clientSecret: process.env.AUTH_CLIENT_SECRET,
            checks: ["pkce", "state"],
            profile: (claims, tokens) => {
                return {
                    id: claims.sub,
                    name: claims.name,
                    username: claims.preferred_username,
                    email: claims.email,
                    avatar: claims.avatar ?? "#",
                };
            },
            authorization: {
                params: {
                    scope: "email openid profile"
                }
            }
        }
    ],
    callbacks: {
        jwt: async function (req) {
            const { token, user: profile, session, profile: claims, account } = req;

            if (profile && claims && account) {
                return {
                    user_id: claims.sub,
                    name: profile.name,
                    username: (profile as any).username,
                    credentials: mapToSessionCredentials(
                        account.access_token ?? "",
                        account.refresh_token ?? "",
                        account.id_token ?? "",
                        account.expires_in ?? 1,
                    ),
                    ...token,
                };
            }

            if (Date.now() < (token as any).credentials.expiresAt) {
                return token;
            }

            try {
                const refreshedTokens = await refreshAccessToken(
                    process.env.AUTH_CLIENT_ID as string,
                    process.env.AUTH_CLIENT_SECRET as string,
                    (token as any).credentials.refreshToken
                );

                return {
                    ...token,
                    credentials: {
                        ...(token as any).credentials,
                        ...mapToSessionCredentials(
                            refreshedTokens.accessToken,
                            refreshedTokens.refreshToken,
                            refreshedTokens.idToken,
                            refreshedTokens.expiresIn
                        ),
                    },
                };
            } catch (err) {
                console.error(err);
                return {
                    ...token,
                    error: "RefreshAccessTokenError",
                };
            }
        },
        session: async function ({ session, token }) {
            if (token) {
                return {
                    ...session,
                    accessToken: (token as any).credentials.accessToken,
                    idToken: (token as any).credentials.idToken,
                    user: {
                        ...session.user,
                        user_id: token.user_id,
                    },
                };
            }

            return session;
        },
    },
});