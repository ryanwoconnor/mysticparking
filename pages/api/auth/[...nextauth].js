import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Initialize Firebase
async function refreshAccessToken(token, user) {
  try {
    if (token.providerId == "credentials") {
      console.log("****************************** REFRESHING");
      var id_token = await user
        .getIdToken()
        .then((response) => response)
        .then((data) => {
          return data;
        });

      var refreshedTokenEmail = {
        ...token,
        error: null,
        id_token: id_token.id_token,
        accessToken: id_token.access_token,
        accessTokenExpires: Date.now() + id_token.expires_in * 1000,
        refreshToken: id_token.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      };

      return refreshedTokenEmail;
    } else {
      const google_url =
        "https://oauth2.googleapis.com/token?" +
        new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken,
        });

      const response = await fetch(google_url, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      });

      const refreshedTokens = await response.json();

      if (!response.ok) {
        throw refreshedTokens;
      }

      var refreshedToken = {
        ...token,
        error: null,
        id_token: refreshedTokens.id_token,
        accessToken: refreshedTokens.access_token,
        accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
        refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      };

      return refreshedToken;
    }
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      httpOptions: {
        timeout: 40000,
      },
    }),
  ],

  jwt: {
    encryption: false,
    maxAge: 60 * 60 * 24 * 30,
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    /* eslint-disable  no-unused-vars */
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (typeof url != "undefined" && url != "undefined") {
        if (url.startsWith("/")) {
          return `${baseUrl}${url}`;
        }
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) {
          return url;
        }
      } else {
        return baseUrl;
      }
    },
    async signIn({ user, account, profile, email }) {
      console.log(account);
      if (typeof email != "undefined") {
        if (email.verificationRequest) {
          console.log("Sending Verification email");
          return true;
        }
      } else {
        if (user) {
          if (profile) {
            if ("id_token" in profile) {
              console.log("Found in Profile");
            }
          }

          return true;
        } else {
          return false;
        }
      }
    },
    async session({ session, token, user }) {
      console.log("SESSION TIME");

      if (user) {
        var id_token = await user.getIdToken();
        console.log(id_token);
      }

      if (user) {
        session.user = user;
      }

      if (token) {
        session.userType = token.userType;

        if (typeof token.user != "undefined") {
          if (typeof token.user.id != "undefined") {
            session.googleid = token.user.id;
          }
        }

        if (typeof token.emailVerified != "undefined") {
          session.emailVerified = token.emailVerified;
        }

        if (typeof token.providerId != "undefined") {
          session.providerId = token.providerId;
        }
        session.accessToken = token.accessToken;
        session.id_token = token.id_token;
        session.error = token.error;
      }

      return session;
    },

    async jwt({ token, user, account }) {
      if (typeof account != "undefined") {
        if (typeof account.type != "undefined") {
          token.providerId = account.type;
        }
      }

      /*try {
        var id_token = await authVar.currentUser.getIdToken(true);
        console.log("****************************Email JWT TOken", id_token);
      } catch (e) {
        console.log(e);
      }*/
      if (user) {
        if ("emailVerified" in user) {
          token.emailVerified = user.emailVerified;
        }
        if ("providerId" in user) {
          if (user.providerId == "firebase") {
            token.id_token = user.id_token;
            token.accessToken = user.id_token;
          }
        } else {
          if (account) {
            if ("id_token" in account) {
              console.log("Found in account");
            }
            token.id_token = account.id_token;
          }
        }
      }

      console.log("THIS IS A JWT");

      if (user) {
        if ("providerId" in user) {
          token.user = { name: "", email: user.email, image: "", id: "24225" };
          token.name = "";
          token.sub = "";
          token.picture = "";
          token.providerAccountId = "24225";
        } else {
          token.user = user;
        }

        if (account && user) {
          if ("provider" in account) {
            if (account.provider == "google") {
              console.log("THIS IS A GOOGLE ACCOUNT");
              user.providerId = account.provider;
              token.accessToken = account.access_token;
              token.accessTokenExpires = account.expires_at;
              token.refreshToken = account.refresh_token;
            }
          }

          if ("providerId" in user) {
            if (user.providerId == "firebase") {
              token.accessToken = user.stsTokenManager.accessToken;
              token.accessTokenExpires = user.stsTokenManager.expirationTime;
              token.refreshToken = user.stsTokenManager.refreshToken;
              user.providerId = "firebase";
            }
          } else {
            token.accessToken = account.access_token;
            token.accessTokenExpires = account.expires_at;
            token.refreshToken = account.refresh_token;
          }

          if (account.type == "email") {
            token.type == "email";
            user.providerId = "email";
          }

          if ("providerAccountId" in account && account.type == "email") {
            token.email = account.providerAccountId;
            token.accessTokenExpires = account.expires_at;
            token.user = { ...token.user, email: account.providerAccountId };
          }
        }

        //What to do for Email Accounts

        //What to do for Google Accounts
        try {
          if (typeof token.id_token != "undefined") {
            if (typeof account != "undefined") {
              if (typeof account.type != "undefined") {
                token.providerId = account.type;
              }
            }
          }
        } catch (e) {
          console.log(e);
          console.log("No id_token found Google");
        }
      }

      //console.log("*************************** FINAL TOKEN ******************");
      //console.log(token);
      if (typeof token.accessTokenExpires != "undefined") {
        // Return previous token if the access token has not expired yet
        if (Date.now() < token.accessTokenExpires) {
          console.log("Current time is less than expiration time");
          //console.log("Current time is less than expiration time, returning",token);

          return token;
        } else {
          console.log(
            "Current time is greater than expiration time, refreshing"
          );

          return refreshAccessToken(token, user);
        }
      } else {
        return token;
      }
    },
  },
};

export default function auth(req, res) {
  NextAuth(req, res, options);
}
