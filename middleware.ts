import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // Protect /admin routes
      if (req.nextUrl.pathname.startsWith("/admin")) {
        // Allow access to login page without token
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }
        // Require token for other admin routes
        return !!token;
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
