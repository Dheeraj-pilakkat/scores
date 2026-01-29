import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import { Admin } from '@/models';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        await dbConnect();
        
        const admin = await Admin.findOne({ username: credentials.username });
        
        if (!admin || !admin.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, admin.password);

        if (!isValid) {
          return null;
        }

        return {
          id: admin._id.toString(),
          name: admin.username,
          email: admin.email,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/master/login',
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    }
  }
};
