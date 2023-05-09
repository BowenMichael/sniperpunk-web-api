import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "../lib/mongodb";
import {GetUser, GetUserFromEmail, UpdateUser} from "../../../../middleware/users";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
    try {
        const url =
            "https://oauth2.googleapis.com/token?" +
            new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: token.refresh_token,
            })
        console.log(url)
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
        })

        const refreshedTokens = await response.json()

        if (!response.ok) {
            throw refreshedTokens
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        }
    } catch (error) {
        console.log(error)

        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}
export const authOptions = {
    adapter : MongoDBAdapter(clientPromise),
    providers : [
        GoogleProvider({
            /*profile(profile) {
                return { role: profile.role ?? "user" }
            },*/
            /*profile(profile) {
                return { role: profile.role ?? 0, ... }
            },*/
            clientId: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET : "",
            authorization:
                {
                    params:
                        {
                            access_type: "offline",
                            prompt: "consent",
                            scope : 'https://www.googleapis.com/auth/userinfo.email',
                            include_granted_scopes: true
                        },
                    
                }
            /*accessTokenUrl: "https://oauth2.googleapis.com/o/oauth2/token",
            requestTokenUrl : "https://oauth2.googleapis.com/o/oauth2/auth",
            authorizationUrl: "https://oauth2.googleapis.com/o/oauth2/auth?response_type=code",*/
        })
        /*EmailProvider({
            name: 'email',
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
            maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
        }),*/
    ],
    session: {
        // Choose how you want to save the user session.
        // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
        // If you use an `adapter` however, we default it to `"database"` instead.
        // You can still force a JWT session by explicitly defining `"jwt"`.
        // When using `"database"`, the session cookie will only contain a `sessionToken` value,
        // which is used to look up the session in the database.
        strategy: "database",

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 24 * 60 * 60, // 24 hours

    },
    jwt: {
        // The maximum age of the NextAuth.js issued JWT in seconds.
        // Defaults to `session.maxAge`.
        maxAge: 60 * 60 * 24 * 30,
        // You can define your own encode/decode functions for signing and encryption
    },
    callbacks: {

        async signIn({ user, account, profile, email, credentials }) {
            if(!account) {
                console.error("no account");
                return;
            }
            
            if (account.provider === "google") {
                //console.log("google account", account)
                profile.role = profile.role ?? "user"
                return profile
            }
            return false;
        },
        async session({ session, user, token, profile }) {
            //console.log(session, user);
            /*if(session.user.role == null){
                console.error("no role", {user : user, session  });
                session.user = await UpdateUser({...user, role : 0});
            }*/
            //session.user = user;
            //const userDB = await GetUserFromEmail(user.email);
            let userDB = await GetUser(user.id);
            //console.log("userDB", userDB, !userDB?.role)
            if(userDB && !userDB?.role){
                userDB = await UpdateUser({...user, role : 0});
                //console.log("userDB with role", userDB, !userDB?.role)

            }
            session.user.role = userDB.role

            //console.log("session", {session, userDB})
            return session // The return type will match the one returned in `useSession()`
        }


    },
    events: {
        signIn : async({user , account, profile, isNewUser }) => {
            if(user == null){
                console.error("no user");
            }
            
            
        },
        async signOut(message) {
            console.log(" logged out")
        },
        async createUser(message) {
            console.log(message.user.email +' logged in');
        },

    },
    pages: {
        signIn: '/login?failed=true',
        signOut: '/login?logout=true',
        error: '/500'
    },
    secret: process.env.JWT_SECRET,
};

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }