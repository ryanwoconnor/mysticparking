import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;

      console.log(path);
      console.log(token);
      //Pages below this line can be used by only hosts.
      if (token) {
        return true;
      } else if (path == "/auth/signin") {
        return true;
      }

      //If nothing above is matched, we force user to sign-up
      else {
        // By default return true only if the token is not null
        // (this forces the users to be signed in to access the page)
        return false;
      }
    },
    pages: {
      signIn: "auth/signin",
    },
  },
});

export const config = {
  matcher: ["/:path*", "/api/:path*"],
};
