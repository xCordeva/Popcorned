import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { useSignOut } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";

export default function PopupUser() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signout] = useSignOut(auth);
  const handleSignOut = async () => {
    try {
      await signout();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <div className="popup-user">
      <h4>My Ratings</h4>
      <h4>My Lists</h4>
      <h4 onClick={handleSignOut}>Sign Out</h4>
    </div>
  );
}
