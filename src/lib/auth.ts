import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import LinkedInProvider from 'next-auth/providers/linkedin';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: (() => {
        const id = process.env.GOOGLE_CLIENT_ID ?? '';
        console.log(`[AUTH_DEBUG] Google Client ID loaded: ${id ? id.slice(0, 5) + '...' + id.slice(-10) : 'MISSING'}`);
        return id;
      })(),
      clientSecret: (() => {
        const secret = process.env.GOOGLE_CLIENT_SECRET ?? '';
        if (!secret) console.warn('[AUTH_DEBUG] WARNING: Google Client Secret is MISSING');
        return secret;
      })(),
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'consent',
          access_type: 'offline'
        }
      }
    }),
    GitHubProvider({
      clientId:     process.env.GITHUB_CLIENT_ID     ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
    LinkedInProvider({
      clientId:     process.env.LINKEDIN_CLIENT_ID     ?? '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? '',
      authorization: { params: { scope: 'openid profile email' } },
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
        role:     { label: 'Role',     type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" }
          });
          const parsed = await res.json();
          if (res.ok && parsed.user) {
            return {
              id: parsed.user.id,
              name: parsed.user.name,
              email: parsed.user.email,
              role: parsed.user.role,
              backendToken: parsed.token
            } as any;
          } else {
            throw new Error(parsed?.message || 'Invalid credentials provided.');
          }
        } catch (err: any) {
          console.error('Credentials auth failed', err);
          // Only throw if it's our parsed API error
          if (err.message && err.message !== 'fetch failed') {
            throw new Error(err.message);
          }
          // 8. Backend safety: Fallback mock authentication if API fails
          console.warn('Backend connection failed, using fallback mock authentication');
          if (credentials.email === 'test@gmail.com') {
            return {
              id: 'mock-12345',
              name: 'Test Setup User',
              email: credentials.email,
              role: 'freelancer',
              backendToken: 'mock_fallback_token_889988'
            } as any;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github' || account?.provider === 'linkedin') {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              image: user.image,
              providerId: account.providerAccountId,
            }),
          });
          
          if (res.ok) {
            const data = await res.json();
            user.id = data.user.id;
            (user as any).role = data.user.role;
            (user as any).backendToken = data.token;
            return true;
          }
          return false;
        } catch (error) {
          console.error("OAuth backend sync failed:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id       = user.id;
        token.role     = (user as any).role ?? 'freelancer';
        token.provider = account?.provider  ?? 'credentials';
        if ((user as any).backendToken) {
          token.backendToken = (user as any).backendToken;
        }
      }
      if (trigger === 'update' && session?.backendToken) {
        token.backendToken = session.backendToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id       = token.id;
        (session.user as any).role     = token.role;
        (session.user as any).provider = token.provider;
        (session as any).backendToken  = token.backendToken;
      }
      return session;
    },
  },
  pages:   { signIn: '/login', error: '/login' },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret:  process.env.NEXTAUTH_SECRET ?? 'bharatgig-dev-secret',
};
