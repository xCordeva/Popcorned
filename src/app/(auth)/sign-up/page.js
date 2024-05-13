"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {
  useSignInWithGoogle,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignUp() {
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [updateProfile] = useUpdateProfile(auth);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Firebase error:", errorCode, errorMessage);
      });
      if (res && res.user) {
        const displayName = `${firstName} ${lastName}`;
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setIncorrect(false);
        await Promise.all([
          sendEmailVerification(auth.currentUser),
          updateProfile({ displayName }),
        ]);
      } else {
        setIncorrect(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };
  const [incorrect, setIncorrect] = useState(false);
  return (
    <div className="sign-box">
      <form onSubmit={handleSignUp}>
        <h1>Sign Up</h1>
        <div className="name-section">
          <div className="input-container">
            <FontAwesomeIcon icon={faUser} />
            <input
              required
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="input-container">
            <FontAwesomeIcon icon={faUser} />
            <input
              required
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="input-container">
          <FontAwesomeIcon icon={faEnvelope} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-container">
          <FontAwesomeIcon icon={faLock} />
          <input
            required
            type="password"
            placeholder="Password"
            pattern=".{6,}"
            title="Password must be at least 6 characters long"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <h5 className={incorrect ? `incorrect-signup` : ""}>
          This email is already in use.
        </h5>
        <button type="submit">Sign up</button>
      </form>
      <button type="button" onClick={handleGoogleSignUp}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/calendizer-cd2df.appspot.com/o/google-icon-logo.svg?alt=media&token=556536e6-7afc-4f0d-b1e8-cb65f2330335"
          alt="google-icon"
        />
        Sign Up with Google
      </button>
      <div className="switch">
        Already a Popcorned member?&nbsp;<Link href="/sign-in">Sign in</Link>
      </div>
    </div>
  );
}
