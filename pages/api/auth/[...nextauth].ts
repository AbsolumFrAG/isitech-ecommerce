import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configurer un ou plusieurs fournisseurs d'authentification
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Login personnalisé",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: {
          label: "Mot de passe",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(crendentials) {
        return await dbUsers.checkUserEmailPassword(
          crendentials!.email,
          crendentials!.password
        );
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  // Custom pages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  session: {
    maxAge: 2592000, // 1 mois
    strategy: "jwt",
    updateAge: 86400,
  },

  //Callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case "credentials":
            token.user = user;
            break;
          case "oauth":
            token.user = await dbUsers.oAuthDBUser(
              user?.email || "",
              user?.name || ""
            );
          default:
            break;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      (session.accessToken = token.accessToken),
        (session.user = token.user as any);
      return session;
    },
  },
});
