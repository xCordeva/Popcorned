"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const [email, setEmail] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState(false);
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);
  const [showUserNotExist, setShowUserNotExist] = useState(false);
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      setIncorrect(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendRecoveryEmail = async () => {
    if (recoveryEmail !== "") {
      try {
        await sendPasswordResetEmail(auth, recoveryEmail);
        setRecoveryEmailSent(true);
        setShowUserNotExist(false);
        setTimeout(() => {
          setForgotPasswordClicked(false);
        }, 2000);
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          setShowUserNotExist(true);
          setRecoveryEmailSent(false);
        } else {
          console.error("Error sending recovery email", error);
        }
      }
    }
  };

  return (
    <div className="sign-box">
      <div
        className={`sign-in-box ${
          forgotPasswordClicked ? `hide-sign-in-box` : ``
        }`}
      >
        <form onSubmit={handleSignIn}>
          <h1>Sign In</h1>
          <div className="input-container">
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <FontAwesomeIcon icon={faLock} />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <h5 className={incorrect ? `incorrect-signin` : ""}>
            Email or password is incorrect.
          </h5>
          <button type="submit">Sign In</button>
        </form>
        <button type="button" onClick={handleGoogleSignIn}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/calendizer-cd2df.appspot.com/o/google-icon-logo.svg?alt=media&token=556536e6-7afc-4f0d-b1e8-cb65f2330335"
            alt="google-icon"
          />
          Sign In with Google
        </button>
        <p
          className="forgot-password"
          onClick={() => setForgotPasswordClicked(true)}
        >
          Forgotten your password?
        </p>
        <div className="switch">
          New to Popcorned? <Link href="/sign-up">Sign Up</Link>
        </div>
      </div>

      <div
        className={`forgot-password-box ${
          forgotPasswordClicked ? `show-forgot-password` : ``
        }`}
      >
        <h1>
          Forgot your password?
          <br />
          <br /> Enter your email to receive a recovery link.
        </h1>

        <div className="input-container">
          <FontAwesomeIcon icon={faEnvelope} />
          <input
            type="email"
            placeholder="Enter your email address"
            required
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
        </div>
        <button onClick={handleSendRecoveryEmail}>Send recovery email</button>
        {showUserNotExist && (
          <p className="user-not-exist">
            Email not found. Please check the email address and try again or
            sign up for a new account.
          </p>
        )}
        {recoveryEmailSent && (
          <p className="recovery-mail-sent">
            Recovery email sent successfully, please check your emails.{" "}
            <FontAwesomeIcon icon={faCircleCheck} />
          </p>
        )}
        <p
          className="back-sign-in"
          onClick={() => setForgotPasswordClicked(false)}
        >
          Back to sign in
        </p>
      </div>
    </div>
  );
}
