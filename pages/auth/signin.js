import {
  getProviders,
  signIn,
  getCsrfToken,
  getSession,
} from "next-auth/react";
import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import dynamic from "next/dynamic";
const Typography = dynamic(() => import("@mui/material/Typography"), {});
const Grid = dynamic(() => import("@mui/material/Grid"), {});

const Button = dynamic(() => import("@mui/material/Button"), {});

const TextField = dynamic(() => import("@mui/material/TextField"), {});

const GoogleIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

export default function Signin({ providers }) {
  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      loginButton(e);
    } else {
      setUserPassword(e.target.value);
    }
  };

  const router = useRouter();
  const [error, setError] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showSignInType, setShowSignInType] = useState("google");
  const [showConfirmationEmail, setShowConfirmationEmail] = useState(false);
  const [showEmailVerified, setShowEmailVerified] = useState(false);
  const [showEmailVerifiedFailure, setShowEmailVerifiedFailure] =
    useState(false);

  const [showResetModal, setShowResetModal] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [redirectUrl, setRedirectUrl] = useState("/");

  const handleModalClose = () => {
    setShowConfirmationEmail(false);
    setShowResetModal(false);
    setShowSignInType("newemail");
    setIsSigningIn(false);
  };

  const handleResetModalClose = () => {
    setShowConfirmationEmail(false);
    setShowResetModal(false);
    setShowSignInType("existingemail");
    setIsSigningIn(false);
  };

  useEffect(() => {
    if (typeof router.query.callbackUrl != "undefined") {
      setRedirectUrl(router.query.callbackUrl);
    }

    if (router.query.verification == "success") {
      setShowEmailVerified(true);
    }

    if (router.query.verification == "failure") {
      setShowEmailVerifiedFailure(true);
    }

    if (router.query.auth == "cleanershare") {
      setShowSignInType("existingemail");
    }
  }, [router]);

  const loginButton = async (values) => {
    values.preventDefault();
    setIsSigningIn(true);
    setError(null);

    try {
      await signIn("credentials", {
        redirect: false,
        username: userEmail,
        password: userPassword,
        callbackUrl: `${redirectUrl}`,
      })
        .then((response) => {
          if (typeof response.ok != "undefined") {
            if (response.ok) {
              setError(null);
              router.push(redirectUrl);
              return response;
            } else {
              console.log("RESPONSE IS AN ERROR");
              throw new Error({ message: "Invalid Username or Password" });
            }
          } else {
            console.log("RESPONSE IS AN ERROR");
            throw new Error({ message: "Invalid Username or Password" });
          }
        })
        .catch((error) => {
          console.log(error);
          setIsSigningIn(false);
          setError(true);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      margin="auto"
    >
      <Grid
        justifyContent="center"
        margin="auto"
        direction="column"
        alignItems="center"
        item
        xs={3}
      >
        <h1>Welcome to Mystic Parking</h1>
        {showEmailVerifiedFailure ? (
          <ErrorMessageComponent message="Email has not been verified. Please click the link we sent you in your email to verify your account." />
        ) : (
          <></>
        )}
        {showSignInType == "google" ? (
          <>
            {Object.values(providers).map((provider, value) => {
              return (
                <div key={value}>
                  <br />
                  <div key={provider.name}>
                    {provider.id == "google" ? (
                      <Button
                        width="100%"
                        data-cy="GoogleButton"
                        justifyContent="center"
                        fullWidth={true}
                        variant="outlined"
                        onClick={() =>
                          signIn(provider.id, {
                            redirect: false,
                          })
                        }
                        startIcon={GoogleIcon}
                      >
                        Continue with Google
                      </Button>
                    ) : (
                      <></>
                    )}
                    {provider.id == "email" ? (
                      <>
                        <EmailSignInButton
                          width="100%"
                          id="signinwithcleanershare"
                          message="Sign-in with Cleanershare"
                          onClick={() => setShowSignInType("existingemail")}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
        {showSignInType == "existingemail" ? (
          <>
            {showEmailVerified ? (
              <Success message="Email successfully verified. Please sign in to continue." />
            ) : (
              <></>
            )}
            {isSigningIn ? <Loading message="Signing in..." /> : <></>}{" "}
            {error ? (
              <div>
                <ErrorMessageComponent message="Please check your username/password, and ensure you have verified your email address." />
              </div>
            ) : (
              <></>
            )}
            {!isSigningIn ? (
              <>
                <Typography fullWidth={true} align="center" variant="h6">
                  Sign in with your Cleanershare Account
                </Typography>
                <br />
                <TextField
                  type="text"
                  id="email"
                  label="Email"
                  name="email"
                  fullWidth={true}
                  width="100%"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <br />
                <br />
                <TextField
                  type="password"
                  id="password"
                  name="password"
                  value={userPassword}
                  fullWidth={true}
                  width="100%"
                  label="Password"
                  onChange={(e) => setUserPassword(e.target.value)}
                  onKeyDown={(e) => {
                    handleKeyPress(e);
                  }}
                />
                <br /> <br />
                <Button
                  variant="contained"
                  id="loginemailbutton"
                  onClick={async (values) => {
                    loginButton(values);
                  }}
                  fullWidth={true}
                  align="center"
                >
                  Login
                </Button>{" "}
              </>
            ) : (
              <></>
            )}
            <br />
            <br />
            <Button
              variant="contained"
              color="secondary"
              href=""
              onClick={(e) => {
                e.preventDefault();
                setShowSignInType("forgotpassword");
              }}
              fullWidth={true}
              align="center"
            >
              Forgot Password?
            </Button>
            <br />
            <br />
            <hr />
            <Typography fullWidth={true} align="center" variant="body1">
              {" "}
              Don&apos;t have a Cleanershare Account?
            </Typography>
            <br />
            <div>
              <Button
                data-cy="GoogleButton"
                variant="outlined"
                onClick={() =>
                  signIn("google", {
                    redirect: false,
                  })
                }
                startIcon={GoogleIcon}
                fullWidth={true}
              >
                Continue with Google
              </Button>
            </div>
            <br />
            <div>
              <EmailSignInButton
                id="newuserbutton"
                message="New&nbsp;Cleanershare&nbsp;Account"
                onClick={(e) => {
                  e.preventDefault();

                  router.replace("/auth/signin", undefined, {
                    shallow: true,
                  });

                  setShowSignInType("newemail");
                }}
              />
            </div>
            <br />
          </>
        ) : (
          <></>
        )}
        {showSignInType == "newemail" ? (
          <>
            {" "}
            <SignUpForm setShowSignInType={setShowSignInType} />
          </>
        ) : (
          <></>
        )}

        {showSignInType == "forgotpassword" ? (
          <>
            <TextField
              type="text"
              id="email"
              label="Email"
              name="email"
              fullWidth={true}
              width="100%"
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
            />

            <br />
            <br />
            <div>
              <Button
                variant="contained"
                type="submit"
                onClick={async (e) => {
                  e.preventDefault();
                  setError(null);

                  fetch("/api/forgotPassword", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({
                      username: userEmail,
                    }),
                  })
                    .then((response) => {
                      return response.json();
                    })
                    .then(() => {});

                  if (error) {
                    throw new Error(error);
                  }
                  setShowResetModal(true);
                }}
              >
                {" "}
                Reset Password
              </Button>
              <br /> <br />
              <Button
                variant="contained"
                color="secondary"
                id="signinwithemail"
                onClick={() => setShowSignInType("existingemail")}
              >
                {"< "}Return to Sign-in
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
        <br />
      </Grid>
    </Grid>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }
  return {
    props: {
      providers: await getProviders(context),
      csrfToken: await getCsrfToken(context),
      session: session,
    },
  };
}

Signin.propTypes = { providers: PropTypes.object.isRequired };
