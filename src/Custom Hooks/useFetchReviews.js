import { useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import useAuth from "./useAuth";

const useFetchReviews = () => {
  // a Redux state to refresh the fetch
  const refetchReviews = useSelector((state) => state.RefetchReviews.value);

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserId = async () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        const uid = user?.uid || null;
        resolve(uid);
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const uid = await getUserId();
      if (!uid) {
        setIsLoading(false);
        return;
      }

      const reviewsRef = query(
        collection(db, `users/${uid}/reviews`),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(reviewsRef);
      const reviewsData = querySnapshot.docs.map((doc) => ({
        firebaseItemId: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsData);
      setIsLoading(false);
    };

    fetchData();
  }, [refetchReviews]);

  const { user } = useAuth();

  const addNewReview = async (newReview) => {
    const uid = await getUserId();

    if (!uid) {
      return;
    }

    const docRef = collection(db, `users/${uid}/reviews`);
    addDoc(docRef, {
      ...newReview,
      username: user.displayName,
      userId: uid,
    });
  };

  // const removeFromWatchlist = async (itemId) => {
  //   const uid = await getUserId();
  //   if (!uid) {
  //     return;
  //   }
  //   deleteDoc(doc(db, `users/${uid}/watchlist`, itemId));
  // };

  return { reviews, addNewReview, isLoading };
};

export default useFetchReviews;
