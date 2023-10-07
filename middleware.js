import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(request) {
    const env = process.env.NODE_ENV;
    var newURL = "";
    if (env == "development") {
      newURL = "https://mystic-parkinggateway-dev-2uh40dbg.uk.gateway.dev";
    } else if (env == "production") {
      newURL = "https://mystic-parkinggateway-2uh40dbg.uk.gateway.dev";
    }

    const session = await getToken({
      req: request,
      secret: process.env.SECRET,
    });

    if (session) {
      // This is what we need to do if someone is not authenticated,
      // and tries to access anything other than createFireBaseUser
      if (
        !session.id_token &&
        !request.url.includes("sendVerificationEmail") &&
        !request.url.includes("createFirebaseUser") &&
        !request.url.includes("/api/auth/") &&
        !request.url.includes("/auth/signin")
      ) {
        const env = process.env.NODE_ENV;
        if (env == "development") {
          return NextResponse.rewrite(
            new URL("http://localhost:3000" + "/auth/signin")
          );
        } else if (env == "production") {
          return NextResponse.rewrite(
            new URL("https://cleanershare.com" + "/auth/signin")
          );
        }
      }
    }
    if (request.nextUrl.pathname === "/vehicle") {
      return NextResponse.rewrite(
        new URL(newURL + "/vehicle" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/api/vehicle") {
      return NextResponse.rewrite(
        new URL(newURL + "/vehicle" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/guest")) {
      return NextResponse.rewrite(
        new URL(newURL + "/guest" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/api/guest")) {
      return NextResponse.rewrite(
        new URL(newURL + "/guest" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/websiteauditlog")) {
      return NextResponse.rewrite(
        new URL(newURL + "/websiteauditlog" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/api/websiteauditlog")) {
      return NextResponse.rewrite(
        new URL(newURL + "/websiteauditlog" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/cohost")) {
      return NextResponse.rewrite(
        new URL(newURL + "/cohost" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/api/cohost")) {
      return NextResponse.rewrite(
        new URL(newURL + "/cohost" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/host")) {
      return NextResponse.rewrite(
        new URL(newURL + "/host" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/api/host")) {
      return NextResponse.rewrite(
        new URL(newURL + "/host" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/activeusers")) {
      return NextResponse.rewrite(
        new URL(newURL + "/activeusers" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/api/activeusers")) {
      return NextResponse.rewrite(
        new URL(newURL + "/activeusers" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/reservation")) {
      return NextResponse.rewrite(
        new URL(newURL + "/reservation" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/api/reservation")) {
      return NextResponse.rewrite(
        new URL(newURL + "/reservation" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/listing") {
      console.log("FOUND LISTING PATH NO API");

      return NextResponse.rewrite(
        new URL(newURL + "/listing" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/api/listing") {
      console.log("FOUND LISTING PATH");
      return NextResponse.rewrite(
        new URL(newURL + "/listing" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/checksamedaycheckins") {
      return NextResponse.rewrite(
        new URL(newURL + "/checksamedaycheckins" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/api/checksamedaycheckins") {
      return NextResponse.rewrite(
        new URL(newURL + "/checksamedaycheckins" + request.nextUrl.search)
      );
    }
    if (request.nextUrl.pathname.startsWith("/api/task")) {
      return NextResponse.rewrite(
        new URL(newURL + "/task" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/task") {
      return NextResponse.rewrite(
        new URL(newURL + "/task" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/api/thermostat") {
      return NextResponse.rewrite(
        new URL(newURL + "/thermostat" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/thermostat") {
      return NextResponse.rewrite(
        new URL(newURL + "/thermostat" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/api/thermostatids") {
      return NextResponse.rewrite(
        new URL(newURL + "/thermostatids" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/thermostatids") {
      return NextResponse.rewrite(
        new URL(newURL + "/thermostatids" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname.startsWith("/api/doorevents")) {
      return NextResponse.rewrite(
        new URL(newURL + "/doorevents" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/doorevents") {
      return NextResponse.rewrite(
        new URL(newURL + "/doorevents" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/api/note") {
      return NextResponse.rewrite(
        new URL(newURL + "/note" + request.nextUrl.search)
      );
    }

    if (request.nextUrl.pathname === "/note") {
      return NextResponse.rewrite(
        new URL(newURL + "/note" + request.nextUrl.search)
      );
    }
  },
  {
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
  }
);

export const config = {
  matcher: ["/:path*", "/api/:path*"],
};
