"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is authenticated, push to home route

        router.push("/");
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      setIncorrect(true);
    }
  };
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };
  const [incorrect, setIncorrect] = useState(false);
  useEffect(() => {
    // Update local storage when user changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);
  return (
    <div className="sign-box">
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
      <div className="switch">
        New to Popcorned? <Link href="/sign-up">Sign Up</Link>
      </div>
    </div>
  );
}
