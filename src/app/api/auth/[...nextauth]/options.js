import CredentialsProvider from "next-auth/providers/credentials";

const NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Enter your username" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" }
            },
            async authorize(credentials, req) {
                const model = credentials.model;
                const res = await fetch(process.env.AUTHENTICATION_ENDPOINT, {
                    method: "POST",
                    body: model,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                return res.json();
            }
        })
    ],
    session: {
        maxAge: 60 * 60,  // 1 hour
        updateAge: 30 * 60, // 30 minutes
    },
    pages: {
        "signin": "/signin"
    }
};

export default NextAuthOptions;