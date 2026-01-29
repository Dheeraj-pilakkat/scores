import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // Protect /master routes
      if (req.nextUrl.pathname.startsWith("/master")) {
        // Allow access to login page without token
        if (req.nextUrl.pathname === "/master/login") {
          return true;
        }
        // Require token for other master routes
        return !!token;
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/master/:path*"],
};
