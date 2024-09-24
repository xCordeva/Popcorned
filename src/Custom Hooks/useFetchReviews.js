import { useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  doc as firestoreDoc, // Renamed import here
  deleteDoc,
  setDoc,
  collectionGroup,
  getDoc as getFirestoreDoc, // Renamed to avoid conflicts
} from "firebase/firestore";
import { useSelector } from "react-redux";
import useAuth from "./useAuth";

const useFetchReviews = () => {
  // a Redux state to refresh the fetch
  const refetchReviews = useSelector((state) => state.RefetchReviews.value);

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user's ID from Firebase
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
      try {
        // Fetch reviews data
        const reviewsQuery = query(
          collectionGroup(db, "reviews"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(reviewsQuery);
        const reviewsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const review = { firebaseItemId: doc.id, ...doc.data() };

            // Fetch the user's photoURL from their document
            if (review.userId) {
              const userDocRef = firestoreDoc(db, "users", review.userId);
              const userDoc = await getFirestoreDoc(userDocRef);
              review.photoURL = userDoc.exists()
                ? userDoc.data().photoURL
                : null;
            }

            return review;
          })
        );

        setReviews(reviewsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setIsLoading(false);
      }
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

  const editReview = async (editedReview, reviewId) => {
    const uid = await getUserId();
    if (!uid) {
      return;
    }
    const docRef = firestoreDoc(db, `users/${uid}/reviews`, reviewId);
    setDoc(docRef, { ...editedReview, userId: uid });
  };

  const removeReview = async (itemId) => {
    const uid = await getUserId();
    if (!uid) {
      return;
    }
    deleteDoc(firestoreDoc(db, `users/${uid}/reviews`, itemId));
  };

  return { reviews, addNewReview, isLoading, editReview, removeReview };
};

export default useFetchReviews;
